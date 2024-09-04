const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdfParse = require('pdf-parse');
const express = require('express');
const multer = require('multer');
const cors = require('cors')
const axios = require('axios');
const port = 3000;
const app = express();

// const corsOptions = {
//     origin: 'https://66d8aed98e21162578d4341b--elaborate-maamoul-e39536.netlify.app',
//     methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
//     allowedHeaders: ['Content-Type','Authorization'],
//     credentials: true,
// };

// app.options('*', cors())

// app.use(cors(corsOptions));

app.use(cors({
  origin: '*', 
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true 
}));

app.use((req, res, next) => {
  
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  next();
});

// Handle preflight requests
app.options('*', cors());

// let corsMiddleware = function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "https://elaborate-maamoul-e39536.netlify.app/");
//     res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'PUT', 'DELETE','OPTIONS');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     next();
// }
// app.use(corsMiddleware)
app.use(express.json())

// app.use(express.static('genai-angular'))

const storage = multer.memoryStorage()

const upload = multer({ storage: storage })

const genAI = new GoogleGenerativeAI("AIzaSyD74poe46N6JeHJvFvAaKbtnI-C_8ZsKfE");

// AIzaSyD74poe46N6JeHJvFvAaKbtnI-C_8ZsKfE

// AIzaSyC3jQqySQaR_tqDk5WuHAaF6zfsm7HJ90g - Latest

async function run(fileData) {

    const data = await pdfParse(fileData);
    const textData = data.text;

    requestString = {
        "owner_name": "San Bernardino College",
        "owner_abbreviation": "SBCCD",
        "owner_address_line1": "address line1",
        "owner_city": "owner's city",
        "owner_state": "owner's state",
        "owner_postal_code": "owner's postal code",
        "payment_days": "payment days",
        "name_of_job_location": "job location",
        "address_line_1_of_job_location": "job location address line 1",
        "city_of_job_location": "job location city",
        "state_of_job_location": "job location state",
        "postal_code_of_job_location": "job location postal code"
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Extract owner name, owner abbreviation, owner address line1, owner city, owner state, owner postal code, payment days, name of job location, address line 1 of job location, city of job location, state of job location and postal code of job location from the following text :${textData};and present the data in key value pairs seperated by comma in a single line and encapsulate each key and value in double inverted commas only; and the response should look like this : ${requestString}; all keys should be in smallcase and key names should be exactly same as shown in ${requestString} and key names should not have spaces in between but underscores like this :${requestString}; just give the relevant data no additional comments needed`
    // const prompt = `Extract the owner name and its abbreviation from ${textData}; encapsulate the values with double inverted commas and present them between [] seperated by comma; and the response should look like this: ${requestArray};`
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log(JSON.stringify(result));
    const text = response.text();
    console.log("run method", text)

    return text;
}

app.post('/api/v1/jde/welcome', async (req, res) => {
    res.send("Welcome to GenAI...")
})

app.post('/upload', upload.single('file'), async (req, res) => {
    // Access the uploaded PDF file using req.file.buffer
    console.log("Uploaded PDF file data", req.file);
    try {
        const pdfBuffer = req.file.buffer;
        const text = await run(pdfBuffer);

        console.log(typeof text);
        console.log("post method1", text)
        // console.log("post method1", JSON.stringify(text))
        // console.log("post method1", JSON.parse(text))
        res.send(text);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the PDF');
    }

});

app.post('/api/v1/jde/contract', async (req, res) => {

    let reqBody = req.body
    const { body, rawBody } = req;
    console.log(reqBody);

    try {

        let userId = 'vinita.modi@ltimindtree.com';
        let pwd = 'Jan_2024#OIC'
        const base64Str = btoa(userId + ':' + pwd);
        let url = 'https://ltim-oracle-oic-bmycycq9gyza-bo.integration.ocp.oraclecloud.com:443/ic/api/integration/v1/flows/rest/GENAI_JDE_SERVICECONTRACTCREATIO/1.0/';

        let body_SERVICECONTRACTCREATIO_1 = {
            "Customer_Alpha_Name": reqBody.Customer_Alpha_Name,
            "Customer_Search_Type": "C",
            "Customer_Address_Line_1": reqBody.Customer_Address_Line_1,
            "Customer_Address_Line_2": "",
            "Customer_Address_Line_3": "",
            "Customer_Address_Line_4": "",
            "Customer_City": reqBody.Customer_City,
            "Customer_State": reqBody.Customer_State,
            "Customer_Postal_Code": reqBody.Customer_Postal_Code,
            "Customer_Country": "US",
            "Customer_Time_Zone": "20",
            "Customer_Payment_Tearms_AR": reqBody.Customer_Payment_Tearms_AR,
            "Customer_Tax_Expl_Code": "V",
            "Customer_Tax_Rate_Area": "NY"
        }
        let httpHeaders = {
            'Content-Type': 'application/json',
            'jde-AIS-Auth-Environment': 'JDV920',
            'jde-AIS-Auth-Role': '*ALL',
            'device': 'SOAPUI',
            'Authorization': 'Basic ' + base64Str
        };

        let GENAI_JDE_SERVICECONTRACTCREATIO = {
            method: 'post',
            url: url,
            headers: httpHeaders,
            data: body_SERVICECONTRACTCREATIO_1
        }

        let SERVICECONTRACTCREATIO_1 = await axios(GENAI_JDE_SERVICECONTRACTCREATIO)

        console.log('SERVICECONTRACTCREATIO_1 (1) Request', GENAI_JDE_SERVICECONTRACTCREATIO);
        console.log('SERVICECONTRACTCREATIO_1 (1) Responce', SERVICECONTRACTCREATIO_1.data);

        if (SERVICECONTRACTCREATIO_1.data.jde_customer_number) {

            let url_2 = 'https://ltim-oracle-oic-bmycycq9gyza-bo.integration.ocp.oraclecloud.com:443/ic/api/integration/v1/flows/rest/GENAI_JDE_SERVICECONTRACTCREATIO/1.0/';
            let body_SERVICECONTRACTCREATIO_SITE = {
                "Customer_Alpha_Name": reqBody.Customer_Alpha_Name,
                "Customer_Search_Type": "ST",
                "Customer_Address_Line_1": reqBody.Customer_Address_Line_1,
                "Customer_Address_Line_2": "",
                "Customer_Address_Line_3": "",
                "Customer_Address_Line_4": "",
                "Customer_City": reqBody.Customer_City,
                "Customer_State": reqBody.Customer_State,
                "Customer_Postal_Code": reqBody.Customer_Postal_Code,
                "Customer_Country": "US",
                "Customer_Time_Zone": "20",
                "Customer_Payment_Tearms_AR": reqBody.Customer_Payment_Tearms_AR,
                "Customer_Tax_Expl_Code": "V",
                "Customer_Tax_Rate_Area": "NY"
            }

            let GENAI_JDE_SERVICECONTRACTCREATIO_SITE = {
                method: 'post',
                url: url_2,
                headers: httpHeaders,
                data: body_SERVICECONTRACTCREATIO_SITE
            }

            let SERVICECONTRACTCREATIO_2_SITE = await axios(GENAI_JDE_SERVICECONTRACTCREATIO_SITE)

            console.log('SERVICECONTRACTCREATIO_SITE (2) Request', GENAI_JDE_SERVICECONTRACTCREATIO_SITE);
            console.log('SERVICECONTRACTCREATIO_SITE (2) Responce', SERVICECONTRACTCREATIO_2_SITE.data);

            if (SERVICECONTRACTCREATIO_2_SITE.data.jde_customer_number) {

                let url_3 = 'https://ltim-oracle-oic-bmycycq9gyza-bo.integration.ocp.oraclecloud.com:443/ic/api/integration/v1/flows/rest/GENAI_JDE_SERVICEEQUIPMENTCREATE/1.0/';

                let body_SERVICEEQUIPMENTCREATE = {
                    "Site_Number": SERVICECONTRACTCREATIO_2_SITE.data.jde_customer_number,
                    "Acquired_Date": "6/21/2024",
                    "Installation_Date": "6/21/2024",
                    "Description": "shantanu"
                }

                let GENAI_JDE_SERVICEEQUIPMENTCREATE = {
                    method: 'post',
                    url: url_3,
                    headers: httpHeaders,
                    data: body_SERVICEEQUIPMENTCREATE
                }

                let SERVICEEQUIPMENTCREATE = await axios(GENAI_JDE_SERVICEEQUIPMENTCREATE)

                console.log('SERVICEEQUIPMENTCREATE (3) Request', GENAI_JDE_SERVICEEQUIPMENTCREATE);
                console.log('SERVICEEQUIPMENTCREATE (3) Responce', SERVICEEQUIPMENTCREATE.data);

                if (SERVICEEQUIPMENTCREATE.data['Previous Equipment Number']) {

                    let url_4 = 'https://ltim-oracle-oic-bmycycq9gyza-bo.integration.ocp.oraclecloud.com:443/ic/api/integration/v1/flows/rest/GENAI_JDE_SER_CON_CREATION_FINAL/1.0/';

                    let body_GENAI_JDE_SER_CON_CREATION_FINAL = {
                        "Header_Description": "SK10",
                        "Header_Customer": SERVICECONTRACTCREATIO_1.data.jde_customer_number,
                        "Header_Site": SERVICECONTRACTCREATIO_2_SITE.data.jde_customer_number,
                        "Header_StartDate": "01/01/2024",
                        "Header_EndDate": "12/31/2024",
                        "Detail_LineType": "EW",
                        "Detail_ServicePackage": "ELITE",
                        "Detail_EquipmentNumber": SERVICEEQUIPMENTCREATE.data['Previous Equipment Number'],
                        "Detail_BillFromDate": "01/01/2024",
                        "Detail_BillThroughDate": "12/31/2024",
                        "Detail_BillCodeFrequency": "Q",
                        "Detail_UnitPrice": 25000
                    }

                    let GENAI_JDE_SER_CON_CREATION_FINAL = {
                        method: 'post',
                        url: url_4,
                        headers: httpHeaders,
                        data: body_GENAI_JDE_SER_CON_CREATION_FINAL
                    }

                    let GENAI_JDE_SER_CON_CREATION = await axios(GENAI_JDE_SER_CON_CREATION_FINAL)

                    console.log('GENAI_JDE_SER_CON_CREATION (4) Request', GENAI_JDE_SER_CON_CREATION_FINAL);
                    console.log('GENAI_JDE_SER_CON_CREATION (4) Responce', GENAI_JDE_SER_CON_CREATION.data);
                    
                res.send({"Created": "Sucess","Contract_Number": GENAI_JDE_SER_CON_CREATION.data['Previous Contract']})
                }

            }

        }

    } catch (error) {

        console.log(error);
        res.status(500).send('Please try anagin later');

    }





})

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

// async function countryValfunc(fileData) {
//     requestCountry = {
//         "owner_country": "owner country"
//     }

//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//     const prompt = `Refer owner's address from ${fileData} and identify the country and present the country name as key value pair as shown in ${requestCountry} with exactly same key name and replace the value with the country's name in ${requestCountry}`

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     return text;
// }
// const countryVal = await countryValfunc(textData);
// console.log("country", countryVal);
