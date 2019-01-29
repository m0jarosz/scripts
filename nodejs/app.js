var app = require('http').createServer(response);
var fs = require('fs');
var io = require('socket.io')(app);
var orasql="";
const oracledb = require('oracledb');
const sqlite3 = require('sqlite3').verbose();
let orareport = new sqlite3.Database('./orareport.sqlite', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the orareport database.');
});

app.listen(3000);
console.log("App running...");

function response(req, res) {
    var file = "";
    if(req.url == "/"){
        file = __dirname + '/index.html';
    } else {
        file = __dirname + req.url;
    }
    fs.readFile(file,
        function (err, data) {
            if (err) {
                res.writeHead(404);
                return res.end('Page or file not found');
            }
            res.writeHead(200);
            res.end(data);
        }
    );
}


//orareport.close((err) => {
//    if (err) {
//        console.error(err.message);
//    }
//    console.log('Close the sqlite3 database connection.');
//});


io.on("connection", function(socket){
    socket.on("sendorauser", function(sent_msg, callback){
        oracledb.getConnection(
        {
            user          :  sent_msg.orauser,
            password      : Buffer.from(sent_msg.orapass, 'base64').toString(),
            connectString : "(DESCRIPTION = (ADDRESS_LIST = (ADDRESS = (COMMUNITY = tcp.world)(PROTOCOL = TCP)(Host = 10.100.104.101)(Port = 1521)))(CONNECT_DATA = (SID = um11)))"
        },
        function(err, connection)
        {
            if (err) { console.error(err); return; }

            orareport.serialize(() => {
                orareport.each(`SELECT id,name,sql FROM reports`, (err, row) => {
                    if (err) {
                        console.error(err.message);
                    }
                    io.sockets.emit("update messages", row.id + "\t" + row.name + "\t" + row.sql);
                    orasql = row.sql;
                });
            });
            connection.execute(
                orasql,
//                "SELECT L.OPIS,KNT.NR_KONTA,L.ROK,L.MC,L.NR,L.DATA_WYPLATY,W.DATA,W.STATUS,W.KWOTA,W.NR_WNIOSKU,KWN.NAZWISKO1,KWN.IMIE1,KWNA.NAZWA_KRAJU,KWNA.NAZWA_MIEJ,KWNA.NR_KODU_POCZ,KWNA.NAZWA_ULICY,KWNA.NR_BUD,KWNA.NR_LOK FROM DOCZ.DOCZ_WYPLATY W LEFT JOIN DOCZ.DOCZ_LISTY2 L ON W.LISTY2_ID=L.ID LEFT JOIN KOS.OS_OSOBA KWN ON W.OSOBA_ID_WN =KWN.ID_OSOBA AND NOT KWN.ID_EWID IS NULL AND KWN.STATUS='A' LEFT JOIN KOS.KAR_ADR_OF KWNA ON KWN.ID_EWID=KWNA.ID_OS_FIZ AND KWNA.DATA_WYM IS NULL LEFT JOIN KOS.OS_KONTO KNT ON W.KONTO_BANKOWE_ID_ODB=KNT.ID_KONTO WHERE L.ROK='2019' AND L.MC='01' AND L.NR='2' ORDER BY L.OPIS,KNT.NR_KONTA",
//                "SELECT DISTINCT L.OPIS AS OPIS ,L.ROK AS ROK FROM DOCZ.DOCZ_LISTY2 L",
                function(err, result)
                {
                    if (err) { console.error(err); return; }
                    var len=result.rows.length;
                    var cells=result.rows[0].length;
                    var resp = "<table>";
                    for(var i=0;i<len;i++)
                    {
                        resp+="<tr>";
                        for(var col=0;col<cells;col++)
                        {
                            resp+="<td>"+result.rows[i][col]+"</td>";
                        }
                        resp+="</tr>";
                    }
                    resp+="</table>";
                    io.sockets.emit("update messages", resp);
                });
        });
//        io.sockets.emit("update messages", sent_msg.orauser+"___"+Buffer.from(sent_msg.orapass, 'base64').toString());
        callback();
    });
});



