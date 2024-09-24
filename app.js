const {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} = require("@google/generative-ai");
const pdfParse = require("pdf-parse");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const port = 3000;
const app = express();

// const corsOptions = {
//   origin: "*",
//   methods: ["GET", "POST", "PUT", "DELETE"],
// };

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

// app.use(cors(corsOptions));
app.use(express.json());

// app.use(express.static("genai-angular"));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const genAI = new GoogleGenerativeAI("AIzaSyC3jQqySQaR_tqDk5WuHAaF6zfsm7HJ90g");

// AIzaSyD74poe46N6JeHJvFvAaKbtnI-C_8ZsKfE

// AIzaSyC3jQqySQaR_tqDk5WuHAaF6zfsm7HJ90g - Latest

async function run(fileData) {
  const data = await pdfParse(fileData);
  const textData = data.text;

  // fs.writeFileSync("pdfData.txt", textData)

  requestString = {
    owner_name: "San Bernardino College",
    owner_abbreviation: "SBCCD",
    owner_address_line1: "address line1",
    owner_city: "owner's city",
    owner_state: "owner's state",
    owner_postal_code: "owner's postal code",
    payment_days: "payment days",
    name_of_job_location: "job location",
    address_line_1_of_job_location: "job location address line 1",
    city_of_job_location: "job location city",
    state_of_job_location: "job location state",
    postal_code_of_job_location: "job location postal code",
  };

  // Hint: old To: and ACKNOWLEDGMENT  or  sent by certified mail
  customer = {
    mailing_name: "San Bernardino Community College District",
    address_line_1: "114 South Del Rosa Drive",
    city: "San Bernardino",
    state: "CA",
    postal_code: 92408,
  };

  // Hint: old To: and ACKNOWLEDGMENT
  site_address_1 = {
    mailing_name: "San Bernardino Valley College",
    address_line_1: "114 South Del Rosa Drive",
    city: "San Bernardino",
    state: "CA",
    postal_code: 92408,
  };

  // Hint: Job Location:
  site_address_2 = {
    mailing_name: "Crafton Hills College",
    address_line_1: "11711 Sand Canyon Rd",
    city: "Yucaipa",
    state: "CA",
    postal_code: 92399,
  };

  // // Hint: Equipment Inventory and Tables
  // equipment_1 = {
  //     "unit": 138924, // Elevator Conveyance #
  //     "Customer": "San Bernardino Community College District", //
  //     "site_address_1": "San Bernardino Valley College",
  //     "description": "San Bernardino Valley College Elevators",
  //     "more_description": "AD/SS"
  // }

  // // Hint: Equipment Inventory and Tables
  // equipment_2 = {
  //     "unit": "054224", // Elevator Conveyance #
  //     "Customer": "San Bernardino Community College District", //
  //     "site_address_2": "Crafton Hills College",
  //     "description": "Crafton Hills College Elevator Equipment", // Table header
  //     "more_description": "LADM" // Location
  // }

  // Hint: Equipment Inventory and Tables
  equipment_1 = {
    "Elevator_Conveyance_#": 138924, // Elevator Conveyance #
    description: "San Bernardino Valley College Elevators",
    Location: "AD/SS",
  };

  // Hint: Equipment Inventory and Tables
  equipment_2 = {
    "Elevator_Conveyance_#": "054224", // Elevator Conveyance #
    description: "Crafton Hills College Elevator Equipment", // Table header
    Location: "LADM", // Location
  };

  requestString1 = {
    customer_name_1: "San Bernardino Valley College",
    address_line_1: "114 South Del Rosa Drive",
    city_1: "San Bernardino",
    state_1: "CA",
    postal_code_1: 92408,
    customer_name_2: "Crafton Hills College",
    address_line_2: "11711 Sand Canyon Rd",
    city_2: "Yucaipa",
    state_2: "CA",
    postal_code_2: 92399,
    Elevator_Conveyance_1: 138924, // Elevator Conveyance #
    description_1: "San Bernardino Valley College Elevators",
    Location_1: "AD/SS",
    Elevator_Conveyance_2: "054224", // Elevator Conveyance #
    description_2: "Crafton Hills College Elevator Equipment", // Table header
    Location_2: "LADM", // Location
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings: safetySettings,
  });
  // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  // const prompt = `Extract owner name, owner abbreviation, owner address line1, owner city, owner state, owner postal code, payment days, name of job location, address line 1 of job location, city of job location, state of job location and postal code of job location from the following text :${textData};
  // and present the data in key value pairs seperated by comma in a single line and encapsulate each key and value in double inverted commas only;
  // and the response should look like this : ${requestString};
  // all keys should be in smallcase and key names should be exactly same as shown in ${requestString} and key names should not have spaces in between but underscores like this :${requestString};
  // just give the relevant data no additional comments needed`

  const prompt = `Extract specific fields from the provided data based on the following instructions and context. 
    The data is organized across different sections like "Acknowledgement Section", "Job Location", and "Equipment Inventory". 
    The goal is to extract fields such as **mailing names**, **addresses**, **city**, **state**, **postal codes**, and **equipment details** (like **Elevator Conveyance**, **description**, and **location**) and present them in a structured JSON format.
    Hints:
    1. **Mailing Name and Address**:
    - For the first set of fields (customer_name_1, address_line_1, city_1, state_1, postal_code_1), extract data from the **old To**.
    - For the second set of fields (customer_name_2, address_line_2, city_2, state_2, postal_code_2), extract data from the **Job Location:**.
    2. **Equipment Details**:
    - For first equipment data (Elevator_Conveyance_1, description_1, Location_1), extract the first set of values from the **Equipment Inventory**.
    ### Example
    {
    "Acknowledgement Section": {
       "mailing_name": "San Bernardino Valley College",
       "address_line": "114 South Del Rosa Drive",
       "city": "San Bernardino",
       "state": "CA",
       "postal_code": "92408"
    },
    "Job Location": {
       "mailing_name": "Crafton Hills College",
       "address_line": "11711 Sand Canyon Rd",
       "city": "Yucaipa",
       "state": "CA",
       "postal_code": "92399"
    },
    "Equipment Inventory": [
       {
           "elevator_conveyance_#": "054224",
           "description": "Crafton Hills College Elevator Equipment",
           "location": "LADM"
       }
       ]
    }
    ### Example output: ${requestString1}
    Extract "customer_name_1"
            "address_line_1"
            "city_1"
            "state_1"
            "postal_code_1"
            "customer_name_2"
            "address_line_2"
            "city_2"
            "state_2"
            "postal_code_2"
            "elevator_conveyance_1"
            "description_1"
            "location_1"
            from the following text :${textData};
    and present the data in key value pairs seperated by comma in a single line and encapsulate each key and value in double inverted commas only; 
    and the response should look like this : ${requestString1}; 
    all keys should be in smallcase and key names should be exactly same as shown in ${requestString1} and key names should not have spaces in between but underscores like this :${requestString1}; 
    just give the relevant data no additional comments needed`;

  // const prompt = `Extract the owner name and its abbreviation from ${textData}; encapsulate the values with double inverted commas and present them between [] seperated by comma; and the response should look like this: ${requestArray};`
  const result = await model.generateContent(prompt);
  const response = await result.response;
  console.log(JSON.stringify(result));
  const text = response.text();
  // console.log("new log....... ," , JSON.parse(text) );

  console.log("run method", text);

  return text;
}

app.post("/upload", upload.single("file"), async (req, res) => {
  // Access the uploaded PDF file using req.file.buffer
  console.log("Uploaded PDF file data", req.file);
  try {
    const pdfBuffer = req.file.buffer;
    let text;
    text = await run(pdfBuffer);

    // if (text.includes("[object Object]")) {
    //   console.log("Due to [object Object] invoking function again....");
    //   text = await run(pdfBuffer);
    // }

    console.log("post method1", text);
    // console.log("post method1", JSON.stringify(text))
    // console.log("post method1", JSON.parse(text))
    res.send(JSON.stringify(text));
  } catch (error) {
    console.error(error);
    // res.status(500).send('Error processing the PDF');
    res.send(error);
  }
});

app.post("/api/v1/jde/contract", async (req, res) => {
  let reqBody = req.body;
  const { body, rawBody } = req;
  console.log(reqBody);

  try {
    let userId = "vinita.modi@ltimindtree.com";
    let pwd = "Jan_2025#OIC";
    const base64Str = btoa(userId + ":" + pwd);
    let url =
      "https://ltim-oracle-oic-bmycycq9gyza-bo.integration.ocp.oraclecloud.com:443/ic/api/integration/v1/flows/rest/GENAI_JDE_SERVICECONTRACTCREATIO/1.0/";

    let body_SERVICECONTRACTCREATIO_1 = {
      Customer_Alpha_Name: reqBody.Customer_Mailing_Name.slice(0,30),
      Customer_Search_Type: "C",
      Customer_Address_Line_1: reqBody.Customer_Address_Line_1,
      Customer_Address_Line_2: "",
      Customer_Address_Line_3: "",
      Customer_Address_Line_4: "",
      Customer_City: reqBody.Customer_City,
      Customer_State: reqBody.Customer_State,
      Customer_Postal_Code: reqBody.Customer_Postal_Code,
      Customer_Country: "US",
      Customer_Time_Zone: "20",
      Customer_Payment_Tearms_AR: "N60",
      Customer_Tax_Expl_Code: "V",
      Customer_Tax_Rate_Area: "NY",
    };
    let httpHeaders = {
      "Content-Type": "application/json",
      "jde-AIS-Auth-Environment": "JDV920",
      "jde-AIS-Auth-Role": "*ALL",
      device: "SOAPUI",
      Authorization: "Basic " + base64Str,
    };

    let GENAI_JDE_SERVICECONTRACTCREATIO = {
      method: "post",
      url: url,
      headers: httpHeaders,
      data: body_SERVICECONTRACTCREATIO_1,
    };

    let SERVICECONTRACTCREATIO_1 = await axios(
      GENAI_JDE_SERVICECONTRACTCREATIO
    );

    console.log(
      "SERVICECONTRACTCREATIO_1 (1) Request",
      GENAI_JDE_SERVICECONTRACTCREATIO
    );
    console.log(
      "SERVICECONTRACTCREATIO_1 (1) Responce",
      SERVICECONTRACTCREATIO_1.data
    );

    if (SERVICECONTRACTCREATIO_1.data.jde_customer_number) {
      let url_2 =
        "https://ltim-oracle-oic-bmycycq9gyza-bo.integration.ocp.oraclecloud.com:443/ic/api/integration/v1/flows/rest/GENAI_JDE_SERVICECONTRACTCREATIO/1.0/";
      let body_SERVICECONTRACTCREATIO_SITE = {
        Customer_Alpha_Name: reqBody.Site1_Mailing_Name,
        Customer_Search_Type: "ST",
        Customer_Address_Line_1: reqBody.Site1_Address_Line_1,
        Customer_Address_Line_2: "",
        Customer_Address_Line_3: "",
        Customer_Address_Line_4: "",
        Customer_City: reqBody.Site1_City,
        Customer_State: reqBody.Site1_State,
        Customer_Postal_Code: reqBody.Site1_Postal_Code,
        Customer_Country: "US",
        Customer_Time_Zone: "20",
        Customer_Payment_Tearms_AR: "N60",
        Customer_Tax_Expl_Code: "V",
        Customer_Tax_Rate_Area: "NY",
      };

      let GENAI_JDE_SERVICECONTRACTCREATIO_SITE = {
        method: "post",
        url: url_2,
        headers: httpHeaders,
        data: body_SERVICECONTRACTCREATIO_SITE,
      };

      let SERVICECONTRACTCREATIO_2_SITE = await axios(
        GENAI_JDE_SERVICECONTRACTCREATIO_SITE
      );

      console.log(
        "SERVICECONTRACTCREATIO_SITE (2) Request",
        GENAI_JDE_SERVICECONTRACTCREATIO_SITE
      );
      console.log(
        "SERVICECONTRACTCREATIO_SITE (2) Responce",
        SERVICECONTRACTCREATIO_2_SITE.data
      );

      if (SERVICECONTRACTCREATIO_2_SITE.data.jde_customer_number) {
        let url_3 =
          "https://ltim-oracle-oic-bmycycq9gyza-bo.integration.ocp.oraclecloud.com:443/ic/api/integration/v1/flows/rest/GENAI_JDE_SERVICEEQUIPMENTCREATE/1.0/";

        let body_SERVICEEQUIPMENTCREATE = {
          Site_Number: SERVICECONTRACTCREATIO_2_SITE.data.jde_customer_number,
          Acquired_Date: "09/23/2024",
          Installation_Date: "09/23/2024",
          Description: reqBody.Equipment_Description.slice(0,30),
          // P1701_Version: " ",
          Unit_Number: reqBody.Equipment_Unit,
          Customer_Number: SERVICECONTRACTCREATIO_1.data.jde_customer_number,
          More_Description: reqBody.Equipment_More_Description,
        };

        // {
        //   "Site_Number": 72039,
        //   "Acquired_Date": "09/23/2024",
        //   "Installation_Date": "09/23/2024",
        //   "Description": "Crafton Hills College",
        //   "Unit_Number": "054272",
        //   "Customer_Number": 72021,
        //   "More_Description": "LADM"
        // }

        let GENAI_JDE_SERVICEEQUIPMENTCREATE = {
          method: "post",
          url: url_3,
          headers: httpHeaders,
          data: body_SERVICEEQUIPMENTCREATE,
        };

        let SERVICEEQUIPMENTCREATE = await axios(
          GENAI_JDE_SERVICEEQUIPMENTCREATE
        );

        console.log(
          "SERVICEEQUIPMENTCREATE (3) Request",
          GENAI_JDE_SERVICEEQUIPMENTCREATE
        );
        console.log(
          "SERVICEEQUIPMENTCREATE (3) Responce",
          SERVICEEQUIPMENTCREATE.data
        );

        if (SERVICEEQUIPMENTCREATE.data["Previous Equipment Number"]  || SERVICEEQUIPMENTCREATE.data["Previous Equipment Number"] === 0) {
          let url_4 =
            "https://ltim-oracle-oic-bmycycq9gyza-bo.integration.ocp.oraclecloud.com:443/ic/api/integration/v1/flows/rest/GENAI_JDE_SER_CON_CREATION_FINAL/1.0/";

          let body_GENAI_JDE_SER_CON_CREATION_FINAL = {
            Header_Description: "SBCCD",
            Header_Customer: SERVICECONTRACTCREATIO_1.data.jde_customer_number,
            Header_Site: SERVICECONTRACTCREATIO_2_SITE.data.jde_customer_number,
            Header_StartDate: "07/01/24",
            Header_EndDate: "06/30/26",
            Detail_LineType: "EW",
            Detail_ServicePackage: "ELITE",
            Detail_EquipmentNumber:
            SERVICEEQUIPMENTCREATE.data["Previous Equipment Number"],
            Detail_BillFromDate: "07/01/24",
            Detail_BillThroughDate: "06/30/26",
            Detail_BillCodeFrequency: "F",
            Detail_UnitPrice: 28792,
          };

          let GENAI_JDE_SER_CON_CREATION_FINAL = {
            method: "post",
            url: url_4,
            headers: httpHeaders,
            data: body_GENAI_JDE_SER_CON_CREATION_FINAL,
          };
          console.log(
            "GENAI_JDE_SER_CON_CREATION (4) Request",
            GENAI_JDE_SER_CON_CREATION_FINAL
          );

          let GENAI_JDE_SER_CON_CREATION = await axios(
            GENAI_JDE_SER_CON_CREATION_FINAL
          );

          
          console.log(
            "GENAI_JDE_SER_CON_CREATION (4) Responce",
            GENAI_JDE_SER_CON_CREATION.data
          );

          res.send({
            Created: "Sucess",
            Contract_Number:
              GENAI_JDE_SER_CON_CREATION.data["Previous Contract"],
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Please try anagin later");
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});


