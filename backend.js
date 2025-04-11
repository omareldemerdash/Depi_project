const express = require('express');
const fs = require('fs');
const path = require('path')
const app = express();
app.set('view engine', 'ejs');

// var router = express.Router();
var departmentResult;
var employeeResult;
var printerResult;
var inkResult;
var report={};

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')))
    
app.listen(3000,()=>{
    console.log('Web Server is running on localhost, port 3000');
});

var mysql = require('mysql');
var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


conn.connect((err)=>{
    if(err){
        throw err;
    }
    console.log('App is connected to inks_db Database throw localhost!');
});

////////////////////////////
var myQuery = "select Department_id , Department_name from departments";
var myQuery2 = "select Employee_id, employee_name from employees";
var myQuery3 = "select Printer_id, printer_model from printers";
var myQuery4 = "select Ink_id, ink_model, printer_id from inks";
var myQuery5 = "select Now_quantity from inks where Ink_model = ?";

////////////////////////////



conn.query(myQuery,(err, result)=>{
    if(err){
        throw err;
    }

    elements = [];
   result.forEach(element => {
        elements.push(element['Department_name']);
    });

    departmentResult=elements;
    console.log('Query Done!');
});

conn.query(myQuery2,(err, result)=>{
    if(err){
        throw err;
    }

    elements = [];
   result.forEach(element => {
        elements.push(element['employee_name']);
    });

    employeeResult=elements;
    console.log('Query2 Done!');
    
}); 

conn.query(myQuery3,(err, result)=>{
    if(err){
        throw err;
    }


    printerResult = JSON.stringify(result);
    console.log('Query3 Done!');
    
}); 

conn.query(myQuery4,(err, result)=>{
    if(err){
        throw err;
    }

    inkResult = JSON.stringify(result);
    console.log('Query4 Done!');    
/*     //to send data use: JSON.stringify(result)
    //to recive data use: JSON.parse(result) and forEach
 */
    
}); 

app.get('/',(req,res)=>{
    // pass array to ejs
    //console.log(printerResult)
    app.set('views',__dirname + '/views');
    res.render('Home', { departments_names: departmentResult, employees_names : employeeResult, printers_models: printerResult, inks_models : inkResult });
});

app.post("/check",  (req, res) => {
    sequentialQueries();

    function getDepartmentId () {
        return new Promise((resolve, reject)=>{
            conn.query(myQuery5, req.body.ink ,(err, result)=>{
                if(err){
                    return reject(err);
                }
                return resolve(result[0]['Now_quantity']);
            });
        });
    };

    async function sequentialQueries () {
        try{
        const ink_quantity = await getDepartmentId();
        res.json(ink_quantity);

        } catch(error){
        console.log(error)
        }
    }

    
 
});

app.post("/request", (req, res) => {
    sequentialQueries();
    function getDepartmentId () {
        return new Promise((resolve, reject)=>{
            conn.query('select Department_id from departments where Department_name= ?',req.body.department,(err, result)=>{
                if(err){
                    return reject(err);
                }
                return resolve(result[0]['Department_id']);
            });
        });
    };

    function getEmployeeId  (){
        return new Promise((resolve, reject)=>{
            conn.query('select employee_id from employees where employee_name= ?',req.body.employee,(err, result)=>{
                if(err){
                    return reject(err);
                }
                return resolve(result[0]['employee_id']);
            });
        });
    };

    function getPrinterId  () {
        return new Promise((resolve, reject)=>{
            conn.query('select printer_id from printers where printer_model= ?',req.body.printer,(err, result)=>{
                if(err){
                    return reject(err);
                }
                return resolve(result[0]['printer_id']);
            });
        });
    };
    
    function getInkID(){
        return new Promise((resolve, reject)=>{
            conn.query('select ink_id from inks where ink_model= ?',req.body.ink,(err, result)=>{
                if(err){
                    return reject(err);
                }
                return resolve(result[0]['ink_id']);
            });
        });
    };

    function insertData(depId, empId, priID, inkId){
        return new Promise((resolve, reject)=>{
            conn.query('Insert into Requests(Employee_id, Printer_id, Ink_id, Request_quantity, Request_time) values (?, ?, ?, ?, Now())',
            [empId, priID, inkId, req.body.quanity],(err, result1)=>{
                if(err){throw err;}           
                console.log('Added to requests table');
                conn.query('Update Inks set Now_quantity = (Inks.Now_quantity - ?) where Inks.Ink_id = (select Ink_id from Requests where Requests.Request_id = ?);', [req.body.quanity, result1.insertId],(err, result)=>{
                    if(err){throw err;}           
                    console.log("Current quantity has modified!");    
                });
    
                conn.query('Update Inks set Total_requests = (Inks.Total_requests - ?) where Inks.Ink_id = (select Ink_id from Requests where Requests.Request_id = ?);', [req.body.quanity, result1.insertId],(err, result)=>{
                    if(err){throw err;}           
                    console.log("Total requests has modified!");   
                });
                return resolve(result1.insertId);
            });
        });
    };

    async function sequentialQueries () {
        try{
        const depId = await getDepartmentId();
        const empId = await getEmployeeId();
        const priID = await getPrinterId();
        const inkId = await getInkID();
        const insertedId = await insertData(depId, empId, priID, inkId);
        res.json(insertedId);

        
        } catch(error){
        console.log(error)
        }
        }

report = {department: req.body.department, employee: req.body.employee, printer: req.body.printer, ink: req.body.ink, quantity: req.body.quanity}
//res.json("Successfully requested! ID: " + insertedId);
})


app.post("/add", (req, res) => {
    sequentialQueries();

    function getInkID(){
        return new Promise((resolve, reject)=>{
            conn.query('select ink_id from inks where ink_model= ?',req.body.ink,(err, result)=>{
                if(err){
                    return reject(err);
                }
                return resolve(result[0]['ink_id']);
            });
        });
    };

    function insertData(inkId){
        return new Promise((resolve, reject)=>{
            conn.query('Insert into adds( Add_quantity, Ink_id, Add_time) values (?, ?, Now())',
            [req.body.quanity, inkId ],(err, result)=>{
                if(err){throw err;}           
                console.log('Added to Adds table!');   
                
                conn.query('Update Inks set Now_quantity = (Inks.Now_quantity + ?) where Inks.Ink_id in (select Ink_id from Adds where Adds.Add_id = ?);', [req.body.quanity, result.insertId],(err, result)=>{
                    if(err){throw err;}           
                    console.log("Current quantity has modified!");    
                });
                
                conn.query('Update Inks set Total_adds = (Inks.Total_adds + ?) where Inks.Ink_id = (select Ink_id from Adds where Adds.Add_id = ?);', [req.body.quanity, result.insertId],(err, result)=>{
                    if(err){throw err;}           
                    console.log("Total adds has modified!");    
                });
                return resolve(result.insertId);
            });
        });
    }
    
    async function sequentialQueries () {
        try{
            const inkId = await getInkID();
            const insertedId = await insertData(inkId);
            res.json(insertedId);

        } catch(error){
            console.log(error)
        }
        }

report = {ink: req.body.ink, quantity: req.body.quanity}
})




app.all('/request_report',(req,res)=>{
    fs.readFile(__dirname + '/views/report page/request_report.html', 'utf8', (err, text) => {
        app.set('views',__dirname + '/views/report page/');
        res.render('request_report', report);
        //res.json("report !");

    });

    });
app.all('/add_report',(req,res)=>{
    fs.readFile(__dirname + '/views/report page/add_report.html', 'utf8', (err, text) => {
        app.set('views',__dirname + '/views/report page/');
        res.render('add_report', report);
        //res.json("report !");

    });

    });


app.all('/request_report2/:id',(req,res)=>{
        sequentialQueries(req.params.id);
        function getRequestId(id){
            return new Promise((resolve, reject)=>{
                conn.query('select * from requests where request_id=?',id,(err, result1)=>{
                    if(err){return reject(err);}
                    return resolve(result1);
                });
            });
        };

        function getEmployeeName(request){
            var employeeName;
            var departmentName;
            return new Promise((resolve, reject)=>{
                conn.query('select Employee_name, Department_id from employees where Employee_id=?', request[0].Employee_id ,async (err, result2)=>{
                    if(err){return reject(err);}
                    employeeName= result2[0].Employee_name;
                    departmentName= await getDepartmentName(result2[0].Department_id);
                    
                    return resolve({employeeName:employeeName, departmentName:departmentName});
                });
            });
        };

        function getDepartmentName(departmentId){
            return new Promise((resolve, reject)=>{
                conn.query('select Department_name from departments where Department_id=?',departmentId ,(err, result3)=>{
                    if(err){return reject(err);}
                    return resolve(result3[0].Department_name);
                });
            });
        };

        function getPrinterModel(request){
            return new Promise((resolve, reject)=>{
                conn.query('select Printer_model from printers where Printer_id=?', request[0].Printer_id ,(err, result2)=>{
                    if(err){ return reject(err);}
                    return resolve(result2[0].Printer_model);
                });
            });
        };

        function getInkModel(request){
            return new Promise((resolve, reject)=>{
                conn.query('select Ink_model from inks where Ink_id=?', request[0].Ink_id ,(err, result2)=>{
                    if(err){ return reject(err);}
                    return resolve(result2[0].Ink_model);
                });
            });
        };


        async function sequentialQueries (id) {
            try{
            var request = await getRequestId(id);
            var requestQuantity = request[0].Request_quantity;
            var requestTime = request[0].Request_time;
            var employee_department = await getEmployeeName(request);
            var printer = await getPrinterModel(request);
            var ink = await getInkModel(request);


            fs.readFile(__dirname + '/views/report page/request_report.html', 'utf8', (err, text) => {
                app.set('views',__dirname + '/views/report page/');
                res.render('request_report', 
                {department: employee_department.departmentName, employee: employee_department.employeeName, printer: printer, ink: ink, quantity: requestQuantity, time: requestTime}
                );
                //console.log(request);
                //res.json(request);     
            });
            } catch(error){
            console.log(error)
            }
        }

        });

app.all('/add_report2/:id',(req,res)=>{
        sequentialQueries(req.params.id);
        function getAddId(id){
            return new Promise((resolve, reject)=>{
                conn.query('select * from adds where Add_id=?',id,(err, result1)=>{
                    if(err){return reject(err);}
                    return resolve(result1);
                });
            });
        };

        function getInkModel(add){
            return new Promise((resolve, reject)=>{
                conn.query('select Ink_model from inks where Ink_id=?', add[0].Ink_id ,(err, result2)=>{
                    if(err){ return reject(err);}
                    return resolve(result2[0].Ink_model);
                });
            });
        };

        async function sequentialQueries (id) {
            try{
            var add = await getAddId(id);
            var addQuantity = add[0].Add_quantity;
            var addTime = add[0].Add_time;
            var ink = await getInkModel(add);


            fs.readFile(__dirname + '/views/report page/add_report.html', 'utf8', (err, text) => {
                app.set('views',__dirname + '/views/report page/');
                res.render('add_report', 
                {ink:ink, addQuantity:addQuantity, addTime:addTime}
                );
                //res.json("report !");
                //console.log(request);
                //res.json(request);     
            });
            }catch(error){
            console.log(error)
            }
        }
    
        });

app.all('/reportAll',(req,res)=>{

    sequentialQueries();

    function getAllInks(){
        return new Promise((resolve, reject)=>{
            conn.query('select * from inks',(err, result)=>{
                if(err){
                    return reject(err);
                }
                return resolve(result);
            });
        });
    };

    
    async function sequentialQueries () {
        try{
        var inks = await getAllInks();

        fs.readFile(__dirname + '/views/report page/reportAll.html', 'utf8', (err, text) => {
            app.set('views',__dirname + '/views/report page/');
            res.render('reportAll',{inks: inks});
            //res.json(inks);
        });

        } catch(error){
        console.log(error)
        }
    }

    });

    app.all('/requestHistory',(req,res)=>{

        sequentialQueries();
    
        function getRequests(){
            return new Promise((resolve, reject)=>{
                conn.query('SELECT r.Request_id, e.Employee_name, p.Printer_model, i.Ink_model,r.Request_quantity, r.Request_time FROM `requests` r, employees e, inks i, printers p where r.Employee_id = e.Employee_id and r.Printer_id = p.Printer_id and r.Ink_id = i.Ink_id ORDER BY r.Request_id DESC; ',(err, result)=>{
                    if(err){
                        return reject(err);
                    }
                    return resolve(result);
                });
            });
        };

    
        
        async function sequentialQueries () {
            try{
            var requests = await getRequests();
    
            fs.readFile(__dirname + '/views/report page/requestHistory.html', 'utf8', (err, text) => {
                app.set('views',__dirname + '/views/report page/');
                res.render('requestHistory',{requests: requests});
                //res.json(inks);
            });
    
            } catch(error){
            console.log(error)
            }
        }
    
        });

        app.all('/addHistory',(req,res)=>{

            sequentialQueries();
        
            function getAdds(){
                return new Promise((resolve, reject)=>{
                    conn.query('SELECT a.Add_id, i.Ink_model, a.add_quantity, a.add_time FROM `adds` a, inks i where a.Ink_id = i.Ink_id ORDER BY a.Add_id DESC; ',(err, result)=>{
                        if(err){
                            return reject(err);
                        }
                        return resolve(result);
                    });
                });
            };
    
        
            
            async function sequentialQueries () {
                try{
                var adds = await getAdds();
        
                fs.readFile(__dirname + '/views/report page/addHistory.html', 'utf8', (err, text) => {
                    app.set('views',__dirname + '/views/report page/');
                    res.render('addHistory',{adds: adds});
                    //res.json(inks);
                });
        
                } catch(error){
                console.log(error)
                }
            }
        
            });
