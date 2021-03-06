define({ "api": [
  {
    "type": "POST",
    "url": "/admin/employee/invite",
    "title": "Admin Employee Invite",
    "name": "TAAU_-_Admin_Employee_Invite",
    "group": "Admin_App_-_AdminUser",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email Entered By Employee</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "acl",
            "description": "<p>Access Control List</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint POST /admin/employee/signin</p> <p>Request Headers</p> <ul> <li>'Content-Type: application/json'</li> </ul> <p>Request Body ( Example )  ( request.body )</p> <p>{ &quot;email&quot;: &quot;user1@gmail.com&quot;, &quot;acl&quot;: { &quot;TRAILER&quot; : [ &quot;VIEW&quot; ], &quot;UPSELL&quot; : [ &quot;VIEW&quot; ] } }</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while sending an Invitation to Employee\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully sent an Invitation to Employee\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/users/inviteEmployee.js",
    "groupTitle": "Admin_App_-_AdminUser"
  },
  {
    "type": "POST",
    "url": "/admin/employee/invite/accept",
    "title": "Employee Invite Accept for Admin App",
    "name": "TAAU_-_Employee_Invite_Accept_for_Admin_App",
    "group": "Admin_App_-_AdminUser",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Invite Token sent to the Employee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of Employee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mobile",
            "description": "<p>Mobile Number of Employee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Employee's Name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "photo",
            "description": "<p>Base64-encoded string of photo</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint POST /admin/employee/invite/accept</p> <p>Request Headers</p> <ul> <li>'Content-Type: application/json'</li> </ul> <p>Request Body ( Example )  ( request.body )</p> <pre><code>{     token: &quot;&quot;,     password: &quot;aBc$567&quot;,     mobile: &quot;919876543210&quot;,     name: &quot;Employee 1&quot; }</code></pre>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while saving Employee account data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully saved Employee account data\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/users/saveEmployee.js",
    "groupTitle": "Admin_App_-_AdminUser"
  },
  {
    "type": "PUT",
    "url": "/admin/employee/profile",
    "title": "Employee Invite Accept for Admin Employee",
    "name": "TAAU_-_Employee_Invite_Accept_for_Admin_Employee",
    "group": "Admin_App_-_AdminUser",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of Employee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mobile",
            "description": "<p>Mobile Number of Employee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Employee's Name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "photo",
            "description": "<p>Base64-encoded string of photo</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Exmployee's Email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "acl",
            "description": "<p>Exployee Access Privileges List ( Only Owner can change this )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employeeId",
            "description": "<p>Employee Id ( Only Owners have to pass it while updating data of other Employees )</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint PUT /admin/employee/profile</p> <p>Request Headers</p> <ul> <li>'Content-Type: application/json'</li> </ul> <p>Request Body ( Example )  ( request.body )</p> <pre><code>{     token: &quot;&quot;,     password: &quot;aBc$567&quot;,     mobile: &quot;919876543210&quot;,     name: &quot;Employee 1&quot;  }</code></pre>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while saving Employee account data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully saved Employee account data\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/users/updateEmployee.js",
    "groupTitle": "Admin_App_-_AdminUser"
  },
  {
    "type": "POST",
    "url": "/admin/employee/signin",
    "title": "Employee SignIn for Admin Employee",
    "name": "TAAU_-_Employee_SignIn_for_Admin_Employee",
    "group": "Admin_App_-_AdminUser",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email Entered By Employee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password Entered By Employee</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint POST /admin/employee/signin</p> <p>Request Headers</p> <ul> <li>'Content-Type: application/json'</li> </ul> <p>Request Body ( Example )  ( request.body )</p> <p>{ &quot;email&quot;: &quot;user1@gmail.com&quot;, &quot;password&quot;: &quot;1234567890&quot; }</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Please enter valid credentials\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully signed in!\",\n        dataObj: {\n            employeeObj: {\n            }\n            \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTM5NWQyZjc4NGFlMzQ0MWM5NDg2YmMiLCJpYXQiOjE1ODA4MTkxODUsImV4cCI6MTU4MTQyMzk4NX0.-Yg9zNJQvACGQ65I5xGzQ8b3YgyO1s-UIpWG_4QptKE\"\n        }\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/users/signIn.js",
    "groupTitle": "Admin_App_-_AdminUser"
  },
  {
    "type": "PUT",
    "url": "/admin/employee/forgotpassword",
    "title": "Forgot Password for Admin Employee",
    "name": "TAAU_-_Forgot_Password_Admin_Employee",
    "group": "Admin_App_-_AdminUser",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email Entered By Employee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "platform",
            "description": "<p>android || ios || web</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint PUT /admin/employee/forgotpassword</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    success: true,\n    message: \"Forgot Password Email Sent Successfully\"\n}",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred in Forgot Password functionality\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/users/forgotPassword.js",
    "groupTitle": "Admin_App_-_AdminUser"
  },
  {
    "type": "POST",
    "url": "/admin/employee/generateotp",
    "title": "Generate OTP and send on Mobile",
    "name": "TAAU_-_Generate_OTP_and_send_on_Mobile",
    "group": "Admin_App_-_AdminUser",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mobile",
            "description": "<p>Mobile of the Customer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "country",
            "description": "<p>Country of Customer</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint POST /admin/employee/generateotp</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    success: true,\n    message: \"Success\"\n}",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while sending OTP Verification SMS\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/users/generateOTP.js",
    "groupTitle": "Admin_App_-_AdminUser"
  },
  {
    "type": "GET",
    "url": "/admin/employee/acl",
    "title": "Get Access Control List for Admin App",
    "name": "TAAU_-_Get_Access_Control_List_for_Admin_App",
    "group": "Admin_App_-_AdminUser",
    "description": "<p>API Endpoint GET /admin/employee/acl</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 \n    {\n        success: true,\n        message: \"Successfully fetched Access Control List\",\n        accessControlList: {\n            \"ADMINEMPLOYEE\": [\"ADD\", \"VIEW\", \"UPDATE\", \"DELETE\"],\n            \"LICENSEE\": [\"ADD\", \"VIEW\", \"UPDATE\", \"DELETE\"],\n            \"LICENSEEEMPLOYEE\": [\"ADD\", \"VIEW\", \"UPDATE\", \"DELETE\"],\n            \"TRAILER\": [\"ADD\", \"VIEW\", \"UPDATE\", \"DELETE\"],\n            \"UPSELL\": [\"ADD\", \"VIEW\", \"UPDATE\", \"DELETE\"],\n            \"INSURANCE\": [\"ADD\", \"VIEW\", \"UPDATE\", \"DELETE\"],\n            \"SERVICING\": [\"ADD\", \"VIEW\", \"UPDATE\", \"DELETE\"],\n            \"REMINDERS\": [\"ADD\", \"VIEW\", \"UPDATE\", \"DELETE\"],\n            \"FINANCIALS\": [\"ADD\", \"VIEW\", \"UPDATE\", \"DELETE\"],\n            \"PAYMENTS\": [\"ADD\", \"VIEW\", \"UPDATE\", \"DELETE\"],\n            \"DOCUMENTS\": [\"ADD\", \"VIEW\", \"UPDATE\", \"DELETE\"],\n            \"RENTALSTATUS\": [\"ADD\", \"VIEW\", \"UPDATE\", \"DELETE\"],\n            \"BLOCK\": [\"ADD\", \"VIEW\", \"UPDATE\", \"DELETE\"],\n            \"RENTALS\": [\"ADD\", \"VIEW\", \"UPDATE\", \"DELETE\"],\n            \"CUSTOMERS\": [\"ADD\", \"VIEW\", \"UPDATE\", \"DELETE\"]\n        }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Access Control List\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/users/getAccessControlList.js",
    "groupTitle": "Admin_App_-_AdminUser"
  },
  {
    "type": "GET",
    "url": "/admin/employee/profile",
    "title": "Get Admin Employee Profile",
    "name": "TAAU_-_Get_Admin_Employee_Profile",
    "group": "Admin_App_-_AdminUser",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employeeId",
            "description": "<p>Employee ID</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /admin/employee/profile</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Employee data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully fetched Employee data\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/users/getEmployee.js",
    "groupTitle": "Admin_App_-_AdminUser"
  },
  {
    "type": "GET",
    "url": "/admin/employees",
    "title": "Get all employees of Admin",
    "name": "TAAU_-_Get_all_employees_of_Admin",
    "group": "Admin_App_-_AdminUser",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization Token</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /admin/employees</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Employees List\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully fetched Employees List\",\n        employeeList: []\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/users/getEmployees.js",
    "groupTitle": "Admin_App_-_AdminUser"
  },
  {
    "type": "PUT",
    "url": "/admin/employee/resetpassword",
    "title": "Reset Password of Admin Employee",
    "name": "TAAU_-_Reset_Password_of_Admin_Employee",
    "group": "Admin_App_-_AdminUser",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Password Reset Token</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password Entered by Employee</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint PUT /admin/employee/resetpassword</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     success: true,\n     message: \"Password is reset successfully\"\n}",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while resetting a password\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/users/resetPassword.js",
    "groupTitle": "Admin_App_-_AdminUser"
  },
  {
    "type": "PUT",
    "url": "/admin/employee/profile/admin",
    "title": "Update Employee Profile by admin Owner",
    "name": "TAAU_-_Update_Employee_Profile_by_Admin_Owner",
    "group": "Admin_App_-_AdminUser",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employeeId",
            "description": "<p>Id of the Employee</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "acl",
            "description": "<p>Access Control List</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of Employee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mobile",
            "description": "<p>Mobile Number of Employee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Employee's Name</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint PUT /admin/employee/profile/admin</p> <p>Request Headers</p> <ul> <li>'Content-Type: application/json'</li> </ul> <p>Request Body ( Example )  ( request.body )</p> <pre><code>{     &quot;employeeId&quot;: &quot;sdsksjdskj&quot;,     &quot;acl&quot;: [&quot;VIEW_TRAILERS&quot;, &quot;ADD_TRAILER&quot;] }</code></pre>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while updating Employee data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully updated Employee data\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/users/updateEmployeeByAdmin.js",
    "groupTitle": "Admin_App_-_AdminUser"
  },
  {
    "type": "POST",
    "url": "/admin/employee/verifyotp",
    "title": "Verify OTP sent on SMS for Admin App",
    "name": "TAAU_-_Verify_OTP_sent_on_SMS_for_Admin_App",
    "group": "Admin_App_-_AdminUser",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mobile",
            "description": "<p>Mobile Number of the Customer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "country",
            "description": "<p>Country of Customer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "otp",
            "description": "<p>OTP sent on the Customer Mobile</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint POST /admin/employee/verifyotp</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    success: true,\n    message: \"Success\"\n}",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while verifying SMS\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/users/verifyOTP.js",
    "groupTitle": "Admin_App_-_AdminUser"
  },
  {
    "type": "POST",
    "url": "/admin/customer",
    "title": "Add Customer",
    "name": "TAAC_-_Add_Customer",
    "group": "Admin_App_-_Customer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "photo",
            "description": "<p>User's Profile Photo ( File )</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "driverLicenseScan",
            "description": "<p>Scanned Image/PDF of User's Driving License ( File )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User Email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User Password</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "name",
            "description": "<p>Full Name of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mobile",
            "description": "<p>Mobile Number of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dob",
            "description": "<p>Date of Birth of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "address",
            "description": "<p>Address of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[country]",
            "description": "<p>Country of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[text]",
            "description": "<p>Text Address of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[pincode]",
            "description": "<p>Pincode of the User Address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[coordinates]",
            "description": "<p>Coordinates of the User Address [latitude, longitude]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[city]",
            "description": "<p>City of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[state]",
            "description": "<p>State of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "driverLicense",
            "description": "<p>Object defining User's Driving License</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "driverLicense[card]",
            "description": "<p>License Number of the User's Driving License</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "driverLicense[expiry]",
            "description": "<p>Expiry Date of the User's Driving License ( 02/23 )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "driverLicense[state]",
            "description": "<p>State of the User's Driving License</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\ncurl --location --request POST 'http://localhost:5000/admin/customer' \\\n--form '{\n    \"email\": \"nehakadam@usernameinfotech.com\",\n    \"mobile\": \"9664815262\",\n    \"name\": \"User 6\",\n    \"address\": {\n        \"country\": \"India\",\n        \"text\": \"Lower Parel, Mumbai, India\",\n        \"pincode\": \"400013\",\n        \"coordinates\": [72.877656, 19.075984]\n    },\n    \"dob\": \"1995-01-20\",\n    \"password\": \"abCd@1234\",\n    \"driverLicense\": {\n        \"card\": \"223782weyet\",\n        \"expiry\": \"06/23\",\n        \"state\": \"NSW\"\n    }\n    \"photo\":@/home/username/Downloads/user.png\n    \"driverLicenseScan\":@/home/username/Downloads/driver_license_sample.jpeg\n}'",
          "type": "json"
        }
      ]
    },
    "description": "<p>API Endpoint POST /admin/customer</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Email is empty\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\",\n        customerObj: {}\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/customers/addCustomer.js",
    "groupTitle": "Admin_App_-_Customer"
  },
  {
    "type": "PUT",
    "url": "/admin/customer/password/change",
    "title": "Change Customer Password",
    "name": "TAAC_-_Change_Customer_Password",
    "group": "Admin_App_-_Customer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "customerId",
            "description": "<p>ID of the Customer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "oldPassword",
            "description": "<p>Old Password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "newPassword",
            "description": "<p>New Password</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint PUT /admin/customer/password/change</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\"\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not change password\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/customers/changePassword.js",
    "groupTitle": "Admin_App_-_Customer"
  },
  {
    "type": "PUT",
    "url": "/admin/customer/password/forgot",
    "title": "Forgot Password",
    "name": "TAAC_-_Forgot_Password",
    "group": "Admin_App_-_Customer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "customerId",
            "description": "<p>ID of the Customer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email Entered By User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "platform",
            "description": "<p>android || ios || web</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint PUT /admin/customer/password/forgot</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     success: true,\n     message: \"Success\"\n}",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n{\n     success: false,\n     message: \"Error occurred in Forgot Password functionality\",\n     errorsList: []\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/customers/forgotPassword.js",
    "groupTitle": "Admin_App_-_Customer"
  },
  {
    "type": "GET",
    "url": "/admin/customer",
    "title": "Get Customers Details",
    "name": "TAAC_-_Get_Customers_Details",
    "group": "Admin_App_-_Customer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of the Customer</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /admin/customer</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Successfully fetched Customers Details\",\n        customerList: []\n    }\n\n\nSample API Call : http://localhost:5000/admin/customer?id=",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Customers Details\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/customers/getCustomer.js",
    "groupTitle": "Admin_App_-_Customer"
  },
  {
    "type": "GET",
    "url": "/admin/customers",
    "title": "Get Customers List",
    "name": "TAAC_-_Get_Customers_List",
    "group": "Admin_App_-_Customer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Trailers to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Trailers to skip</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /admin/customers</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Successfully fetched Customers List\",\n        customerList: []\n    }\n\n\nSample API Call : http://localhost:5000/admin/customers?count=10&skip=0",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Customers List\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/customers/getCustomers.js",
    "groupTitle": "Admin_App_-_Customer"
  },
  {
    "type": "POST",
    "url": "/admin/customer/otp/resend",
    "title": "Resend OTP",
    "name": "TAAC_-_Resend_OTP",
    "group": "Admin_App_-_Customer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "customerId",
            "description": "<p>ID of the Customer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mobile",
            "description": "<p>Mobile of the Customer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "country",
            "description": "<p>Country of Customer</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "testMode",
            "description": "<p>Whether this is a test mode</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint POST /admin/customer/otp/resend</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Token is invalid\"\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n    {\n        success: true,\n        message: \"Success\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/customers/sendOTPVerification.js",
    "groupTitle": "Admin_App_-_Customer"
  },
  {
    "type": "PUT",
    "url": "/admin/customer/password/reset",
    "title": "Reset Password",
    "name": "TAAC_-_Reset_Password",
    "group": "Admin_App_-_Customer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Password Reset Token</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password Entered by User</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint PUT /admin/customer/password/reset</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     success: true,\n     message: \"Password is reset successfully\"\n}",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while resetting a password\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/customers/resetPassword.js",
    "groupTitle": "Admin_App_-_Customer"
  },
  {
    "type": "PUT",
    "url": "/admin/customer/verify/driverlicense",
    "title": "Save Customer Driver License Document Verification details",
    "name": "TAAC_-_Save_Customer_Driver_License_Document_Verification_details",
    "group": "Admin_App_-_Customer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "customerId",
            "description": "<p>Id of the Customer record, for edit request only</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "isAccepted",
            "description": "<p>Whether Customer Driver License Document is Accepted</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Customer Driver License Document Verification details</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while saving Customer Driver License Document Verification details\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n\n{\n     success: true,\n     message: \"Successfully saved Customer Driver License Document Verification details\"\n}",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/customers/verifyCustomerDriverLicense.js",
    "groupTitle": "Admin_App_-_Customer"
  },
  {
    "type": "POST",
    "url": "/admin/customer/email/verify/resend",
    "title": "Send Email Verification Link",
    "name": "TAAC_-_Send_Email_Verification_Link",
    "group": "Admin_App_-_Customer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "customerId",
            "description": "<p>ID of the Customer</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint POST /admin/customer/email/verify/resend</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Token is invalid.\"\"\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/customers/sendEmailVerification.js",
    "groupTitle": "Admin_App_-_Customer"
  },
  {
    "type": "PUT",
    "url": "/admin/customer",
    "title": "Update Customer",
    "name": "TAAC_-_Update_Customer",
    "group": "Admin_App_-_Customer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "customerId",
            "description": "<p>ID of the Customer</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "photo",
            "description": "<p>User's Profile Photo ( File )</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "driverLicenseScan",
            "description": "<p>Scanned Image/PDF of User's Driving License ( File )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User Email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User Password</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "name",
            "description": "<p>Full Name of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mobile",
            "description": "<p>Mobile Number of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dob",
            "description": "<p>Date of Birth of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Address of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "address[country]",
            "description": "<p>Country of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "address[text]",
            "description": "<p>Text Address of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "address[pincode]",
            "description": "<p>Pincode of the User Address</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "address[coordinates]",
            "description": "<p>Coordinates of the User Address [latitude, longitude]</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "driverLicense",
            "description": "<p>Object defining User's Driving License</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "driverLicense[card]",
            "description": "<p>License Number of the User's Driving License</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "driverLicense[expiry]",
            "description": "<p>Expiry Date of the User's Driving License ( 02/23 )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "driverLicense[state]",
            "description": "<p>State of the User's Driving License</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\n    curl --location --request PUT 'http://localhost:5000/admin/customer' \\\n    --form 'reqBody={\n        \"mobile\":  \"919876543210\"\n    }' \\\n    --form 'photo=@/home/username/Downloads/user.png' \\\n    --form 'driverLicenseScan=@/home/username/Downloads/driver_license_sample.jpeg'\n\n\nRequest Body ( Example )  ( request.body.reqBody )\n\n    {\n        \"address\": {\n            \"text\" : \"NorthBridge, NSW, Australia\"\n        }\n    }",
          "type": "json"
        }
      ]
    },
    "description": "<p>API Endpoint that can used to update User data</p> <p>Request Headers</p> <ul> <li>'Content-Type: application/json'</li> </ul>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n\n    {\n        success: false,\n        message: \"Could not save User data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "userObj",
            "description": "<p>User Object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 \n    {\n        success: true,\n        message: \"Success\",\n        userObj: {\n            \"_id\": \"\",\n            \"email\": \"user1@gmail.com\",\n            \"mobile\": \"919876543210\",\n            \"name\": \"Mr user 1\",\n            \"address\": {\n                \"text\" : \"NorthBridge, NSW, Australia\", \n                \"pincode\" : \"1560\", \n                \"coordinates\" : [ -33.8132, 151.2172 ]\n            },\n            \"dob\": \"2020-01-20\",\n            \"driverLicense\": {\n                \"card\": \"223782weyet\",\n                \"expiry\": \"2022-06-20\",\n                \"state\": \"MH\",\n                \"scan\": driverLicensePicture\n            }\n        }\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/customers/updateCustomer.js",
    "groupTitle": "Admin_App_-_Customer"
  },
  {
    "type": "POST",
    "url": "/admin/customer/otp/verify",
    "title": "Verify Mobile Number of the Customer",
    "name": "TAAC_-_Verify_Mobile_Number_of_the_Customer",
    "group": "Admin_App_-_Customer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "customerId",
            "description": "<p>ID of the Customer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mobile",
            "description": "<p>Mobile Number of the Customer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "country",
            "description": "<p>Country of Customer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "otp",
            "description": "<p>OTP sent on the Customer Mobile</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "testMode",
            "description": "<p>Whether this is a test mode</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint POST /admin/customer/otp/verify</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Token is invalid\"\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/customers/verifyOTP.js",
    "groupTitle": "Admin_App_-_Customer"
  },
  {
    "type": "GET",
    "url": "/admin/financial/licensee",
    "title": "Get the Financial Summary of Trailer Rentals",
    "name": "TAAT_-_Get_the_Financial_Summary_of_Trailer_Rentals",
    "group": "Admin_App_-_Financial",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "startDate",
            "description": "<p>Start Date of the period for which Financial Summary has to be calculated</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "endDate",
            "description": "<p>End Date of the period for which Financial Summary has to be calculated</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /admin/financial/licensee</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Successfully fetched Financial Summary\",\n        financialsObj: {\n            total: 250,\n            invoicesList: [ ],\n            totalByTypeList: [ ]\n        }\n    }\n\nSample API Call : GET http://localhost:5000/admin/financial/licensee",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Financial Summary\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/trailers/getFinancialsLicensee.js",
    "groupTitle": "Admin_App_-_Financial"
  },
  {
    "type": "GET",
    "url": "/admin/financial/trailer",
    "title": "Get the Financial Summary of Trailer Rentals",
    "name": "TAAT_-_Get_the_Financial_Summary_of_Trailer_Rentals",
    "group": "Admin_App_-_Financial",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "startDate",
            "description": "<p>Start Date of the period for which Financial Summary has to be calculated</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "endDate",
            "description": "<p>End Date of the period for which Financial Summary has to be calculated</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /admin/financial/trailer</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Successfully fetched Financial Summary\",\n        financialsObj: {\n            total: 250,\n            invoicesList: [ ],\n            totalByTypeList: [ ]\n        }\n    }\n\nSample API Call : GET http://localhost:5000/admin/financial/trailer",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Financial Summary\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/trailers/getFinancialsTrailer.js",
    "groupTitle": "Admin_App_-_Financial"
  },
  {
    "type": "PUT",
    "url": "/admin/licensee/employee/profile",
    "title": "Employee Update Profile",
    "name": "TAAL_-_Employee_Update_Profile",
    "group": "Admin_App_-_Licensee",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "employeePhoto",
            "description": "<p>User's Profile Photo ( File )</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "employeeDriverLicenseScan",
            "description": "<p>Scanned Image/PDF of User's Driving License ( File ) [ Driver license ( Front &amp; Back ) ]</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "employeeAdditionalDocumentScan",
            "description": "<p>Scanned Image/PDF of User's Additional Document ( File ) [ Passport, ID card ( Front &amp; Back ), Photo card (New South Wales) ]</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "reqBody",
            "description": "<p>Request JSON data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mobile",
            "description": "<p>Mobile Number of Employee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "country",
            "description": "<p>Employee's Country</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Employee's Name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Exmployee's Email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dob",
            "description": "<p>Date of Birth ( &quot;YYYY-MM-DD&quot; format )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Type of Employee ( &quot;employee&quot;, &quot;representative&quot;, &quot;director&quot;, &quot;executive&quot; )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Employee's Title in Company</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "acl",
            "description": "<p>Exployee Access Privileges List ( Only Owner can change this )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employeeId",
            "description": "<p>Employee Id ( Only Admins have to pass it while updating data of other Employees )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "driverLicense",
            "description": "<p>Driver License Details</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "driverLicense[card]",
            "description": "<p>License Number of Driver License</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "driverLicense[expiry]",
            "description": "<p>Expiry Date of Driver License</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "driverLicense[state]",
            "description": "<p>State in which Driver License is issued</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "address",
            "description": "<p>Address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[text]",
            "description": "<p>Address Text</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[pincode]",
            "description": "<p>Address Pincode</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[coordinates]",
            "description": "<p>Address Location [latitude, longitude]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[city]",
            "description": "<p>Address City</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[state]",
            "description": "<p>Address State</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[country]",
            "description": "<p>Address Country</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\ncurl --location --request PUT 'http://localhost:5000/admin/licensee/employee/profile/' \\\n--form 'reqBody={\n    \"employeeId\": \"123\",\n    \"name\": \"Owner 1\"\n}'",
          "type": "json"
        }
      ]
    },
    "description": "<p>API Endpoint PUT /admin/licensee/employee/profile</p> <p>Request Headers</p> <ul> <li>'Content-Type: application/json'</li> </ul>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while updating Employee account data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "employeeObj",
            "description": "<p>Employee object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully updated Employee account data\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/licensees/updateEmployee.js",
    "groupTitle": "Admin_App_-_Licensee"
  },
  {
    "type": "GET",
    "url": "/admin/licensees",
    "title": "Get Licensees List",
    "name": "TAAL_-_Get_Licensees_List",
    "group": "Admin_App_-_Licensee",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn reque</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Trailers to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Trailers to skip</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /admin/licensees</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Successfully fetched Licensee List\",\n        licenseeList: []\n    }\n\n\nSample API Call : http://localhost:5000/admin/licensees?count=10&skip=0",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Licensee List\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/licensees/getLicensees.js",
    "groupTitle": "Admin_App_-_Licensee"
  },
  {
    "type": "POST",
    "url": "/admin/licensee",
    "title": "Licensee Signup",
    "name": "TAAL_-_Licensee_Signup",
    "group": "Admin_App_-_Licensee",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "licenseeLogo",
            "description": "<p>Licensee Business Logo ( File ) ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "licenseeProofOfIncorporation",
            "description": "<p>Licensee Proof of Incorporation of a Business ( File ) ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "employeePhoto",
            "description": "<p>User's Profile Photo ( File ) ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "employeeDriverLicenseScan",
            "description": "<p>Scanned Image/PDF of User's Driving License ( File ) [ Driver license ( Front &amp; Back ) ] ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "employeeAdditionalDocumentScan",
            "description": "<p>Scanned Image/PDF of User's Additional Document ( File ) [ Passport, ID card ( Front &amp; Back ), Photo card (New South Wales) ] ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "reqBody",
            "description": "<p>Request JSON data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[name]",
            "description": "<p>Licensee Name ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[email]",
            "description": "<p>Licensee Email ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[mobile]",
            "description": "<p>Licensee Mobile ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[country]",
            "description": "<p>Licensee Country ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[businessType]",
            "description": "<p>Business Type [&quot;individual&quot;, &quot;company&quot;] ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "licensee[address]",
            "description": "<p>Licensee Address ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.text]",
            "description": "<p>Licensee Address Text</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.pincode]",
            "description": "<p>Licensee Address Pincode</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.coordinates]",
            "description": "<p>Licensee Address Location [latitude, longitude]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.city]",
            "description": "<p>Licensee City</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.state]",
            "description": "<p>Licensee State</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.country]",
            "description": "<p>Licensee Country</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "licensee[workingDays]",
            "description": "<p>Working Days</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[workingHours]",
            "description": "<p>Working Hours</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "licensee[licenseeLocations]",
            "description": "<p>Array of Licensee Locations</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.text]",
            "description": "<p>Licensee Address Text</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.pincode]",
            "description": "<p>Licensee Address Pincode</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.coordinates]",
            "description": "<p>Licensee Address Location [latitude, longitude]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.city]",
            "description": "<p>Licensee City</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.state]",
            "description": "<p>Licensee State</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.country]",
            "description": "<p>Licensee Country</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[bsbNumber]",
            "description": "<p>BSB Number of the Licensee ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[accountNumber]",
            "description": "<p>Bank Account Number of Licensee ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[mcc]",
            "description": "<p>Merchant Category Code ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[url]",
            "description": "<p>URL of Business Website</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[productDescription]",
            "description": "<p>Business/Core Product Description ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[taxId]",
            "description": "<p>Company Tax ID - Australian Company Number (ACN) ( required, 9 numberic digits )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[name]",
            "description": "<p>Owner Name ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[email]",
            "description": "<p>Owner Email ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[mobile]",
            "description": "<p>Owner Mobile ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[country]",
            "description": "<p>Owner Country ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[password]",
            "description": "<p>Owner's Password  ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[title]",
            "description": "<p>Owner Title in Company ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[dob]",
            "description": "<p>Owner Date of Birth ( &quot;YYYY-MM-DD&quot; format ) ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "employee[address]",
            "description": "<p>Owner Address ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[address.text]",
            "description": "<p>Owner Address Text</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[address.pincode]",
            "description": "<p>Owner Address Pincode</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[address.coordinates]",
            "description": "<p>Owner Address Location [latitude, longitude]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[address.city]",
            "description": "<p>Owner Address City</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[address.state]",
            "description": "<p>Owner Address State</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[address.country]",
            "description": "<p>Owner Address Country</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "employee[driverLicense]",
            "description": "<p>Driver License Details ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[driverLicense.card]",
            "description": "<p>License Number of Driver License</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[driverLicense.expiry]",
            "description": "<p>Expiry Date of Driver License</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[driverLicense.state]",
            "description": "<p>State in which Driver License is issued</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example: ",
          "content": "\n\ncurl --location --request POST 'http://localhost:5000/admin/licensee' \\\n--form 'reqBody={\n    \"employee\": {\n        \"name\": \"Neha Kadam\",\n        \"mobile\": \"9664815262\",\n        \"country\": \"india\",\n        \"email\": \"neha1@licenseetrailers.com\",\n        \"password\": \"aBcd@1234\",\n        \"title\": \"Owner\",\n        \"dob\": \"1970-05-15\",\n        \"driverLicense\": {\n            \"card\": \"223782weyet\",\n            \"expiry\": \"06/23\",\n            \"state\": \"NSW\"\n        },\n        \"address\": {\n            \"text\": \"NorthBridge, NSW, Australia\",\n            \"pincode\": \"1560\",\n            \"coordinates\": [-33.8132, 151.2172],\n            \"city\": \"Sydney\",\n            \"state\": \"NSW\",\n            \"country\": \"Australia\"\n        }\n    },\n    \"licensee\": {\n        \"name\": \"Neha'\\''s Trailers\",\n        \"mobile\": \"9664815262\",\n        \"country\": \"india\",\n        \"email\": \"neha1@licenseetrailers.com\",\n        \"address\": {\n            \"text\": \"NorthBridge, NSW, Australia\",\n            \"pincode\": \"1560\",\n            \"coordinates\": [-33.8132, 151.2172],\n            \"city\": \"Sydney\",\n            \"state\": \"NSW\",\n            \"country\": \"Australia\"\n        },\n        \"workingDays\": [\"Monday\",\"Tuesday\",\"Wednesday\"],\n        \"workingHours\": \"0700-1900\",\n        \n        \"businessType\": \"individual\",\n        \"bsbNumber\": \"ABCDEF\",\n        \"accountNumber\": \"AB1234\",\n        \"mcc\": \"7513\",\n        \"url\": \"http://neha1.licenseetrailers.com\",\n        \"productDescription\": \"Trailer Rental\", \n        \"taxId\": \"123456789\"\n    }\n}' \\\n--form 'licenseeLogo=@/home/username/Downloads/company_logo.jpeg' \\\n--form 'licenseeProofOfIncorporation=@/home/username/Downloads/proofOfIncorporation.png' \\\n--form 'employeePhoto=@/home/username/Downloads/user.png' \\\n--form 'employeeDriverLicenseScan=@/home/username/Downloads/driver_license_sample.jpeg'",
          "type": "json"
        }
      ]
    },
    "description": "<p>API Endpoint POST /admin/licensee</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while creating Licensee Account\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "licenseeObj",
            "description": "<p>Licensee details object</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "employeeObj",
            "description": "<p>Onwer details object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n   {\n        success: true,\n        message: \"Success\",\n        licenseeObj: {\n            isEmailVerified: false,\n            businessType: 'individual',\n            availability: true,\n            _id: '5e61dccae0c80415dd15d6d4',\n            name: 'Licensee 1',\n            email: 'licensee1@gmail.com',\n            mobile: '919876543210',\n            address: {\n                text: 'NorthBridge, NSW, Australia',\n                pincode: '1560',\n                location: [Object]\n            },\n            licenseeLocations: [ [Object] ],\n            proofOfIncorporation: 'http://localhost:5000/file/licenseeproof/5e61dccae0c80415dd15d6d4',\n            logo: 'http://localhost:5000/file/licenseelogo/5e61dccae0c80415dd15d6d4',\n            createdAt: '2020-03-06T05:16:58.146Z',\n            updatedAt: '2020-03-06T05:16:58.148Z',\n            __v: 0\n        },\n        employeeObj: {\n            isOwner: true,\n            acl: {\n                'TRAILER': ['VIEW', 'ADD', 'UPDATE'],\n                'UPSELL': ['VIEW', 'ADD', 'UPDATE']\n            },\n            isEmailVerified: false,\n            _id: '5e61dccae0c80415dd15d6d6',\n            name: 'Owner 1',\n            mobile: '919876543210',\n            email: 'owner@trailerslicensee.com',\n            licenseeId: '5e61dccae0c80415dd15d6d4',\n            createdAt: '2020-03-06T05:16:58.152Z',\n            updatedAt: '2020-03-06T05:16:58.153Z',\n            __v: 0\n        }\n   }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/licensees/saveLicensee.js",
    "groupTitle": "Admin_App_-_Licensee"
  },
  {
    "type": "PUT",
    "url": "/admin/licensee/verify/proofofincorporation",
    "title": "Save Licensee Proof Of Incorporation Document Verification details",
    "name": "TAAL_-_Save_Licensee_Proof_Of_Incorporation_Document_Verification_details",
    "group": "Admin_App_-_Licensee",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licenseeId",
            "description": "<p>Id of the Licensee record, for edit request only</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "isAccepted",
            "description": "<p>Whether Licensee Document is Accepted</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Licensee Document Verification details</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while saving Licensee Document Verification details\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n\n{\n     success: true,\n     message: \"Successfully saved Licensee Document Verification details\"\n}",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/licensees/verifyLicenseeDocument.js",
    "groupTitle": "Admin_App_-_Licensee"
  },
  {
    "type": "PUT",
    "url": "/admin/licensee",
    "title": "Update Licensee Details",
    "name": "TAAL_-_Update_Licensee_Details",
    "group": "Admin_App_-_Licensee",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "licenseeLogo",
            "description": "<p>Licensee Business Logo ( File )</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "licenseeProofOfIncorporation",
            "description": "<p>Licensee Proof of Incorporation of a Business ( File )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "reqBody",
            "description": "<p>Request JSON data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[name]",
            "description": "<p>Licensee Name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[email]",
            "description": "<p>Licensee Email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[country]",
            "description": "<p>Licensee Country</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[mobile]",
            "description": "<p>Licensee Mobile</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[businessType]",
            "description": "<p>Business Type [&quot;individual&quot;, &quot;company&quot;]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[bsbNumber]",
            "description": "<p>BSB Number of thhe Licensee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[accountNumber]",
            "description": "<p>Bank Account Number of Licensee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[mcc]",
            "description": "<p>Merchant Category Code</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[url]",
            "description": "<p>URL of Business Website</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[productDescription]",
            "description": "<p>Business/Core Product Description</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[taxId]",
            "description": "<p>Company Tax ID - Australian Company Number (ACN)</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "licensee[address]",
            "description": "<p>Licensee Address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.text]",
            "description": "<p>Licensee Address Text</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.pincode]",
            "description": "<p>Licensee Address Pincode</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.coordinates]",
            "description": "<p>Licensee Address Location Coordinates [latitude, longitude]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.city]",
            "description": "<p>Licensee City</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.state]",
            "description": "<p>Licensee State</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.country]",
            "description": "<p>Licensee Country</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "licensee[licenseeLocations]",
            "description": "<p>Array of Licensee Locations</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.text]",
            "description": "<p>Licensee Address Text</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.pincode]",
            "description": "<p>Licensee Address Pincode</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.coordinates]",
            "description": "<p>Licensee Address Location Coordinates [latitude, longitude]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.city]",
            "description": "<p>Licensee City</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.state]",
            "description": "<p>Licensee State</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.country]",
            "description": "<p>Licensee Country</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\ncurl --location --request PUT 'http://localhost:5000/admin/licensee/' \\\n--form 'reqBody={\n    \"accountNumber\": \"32463468434\",\n    \"bsbNumber\": \"AGDG34734343\",\n    \"radius\": 200\n}'",
          "type": "json"
        }
      ]
    },
    "description": "<p>API Endpoint PUT /admin/licensee</p> <p>Request Headers</p> <ul> <li>'Content-Type: application/json'</li> </ul>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while updating Licensee data\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "licenseeObj",
            "description": "<p>Licensee object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n   {\n        success: true,\n        message: \"Successfully updated Licensee data\",\n        licenseeObj: {\n            isEmailVerified: false,\n            businessType: 'individual',\n            availability: true,\n            _id: '5e61dccae0c80415dd15d6d4',\n            name: 'Licensee 1',\n            email: 'licensee1@gmail.com',\n            mobile: '919876543210',\n            address: {\n                text: 'NorthBridge, NSW, Australia',\n                pincode: '1560',\n                coordinates: [43.8477,-111.6932]\n            },\n            licenseeLocations: [ \n                {\n                    text: 'NorthBridge, NSW, Australia',\n                    pincode: '1560',\n                    coordinates: [43.8477,-111.6932]\n                }\n            ],\n            proofOfIncorporation: 'http://localhost:5000/file/licenseeproof/5e61dccae0c80415dd15d6d4',\n            logo: 'http://localhost:5000/file/licenseelogo/5e61dccae0c80415dd15d6d4',\n            createdAt: '2020-03-06T05:16:58.146Z',\n            updatedAt: '2020-03-06T05:16:58.148Z',\n            __v: 0\n        }\n   }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/licensees/updateLicensee.js",
    "groupTitle": "Admin_App_-_Licensee"
  },
  {
    "type": "GET",
    "url": "/admin/licensee/insurance",
    "title": "Get Trailer Insurance List",
    "name": "TAAL_-_Get_Trailer_Insurance_List",
    "group": "Admin_App_-_LicenseeTrailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn reque</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Trailers to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Trailers to skip</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET admin/licensee/insurance</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Successfully fetched Trailer Insurance List\",\n        insuranceList: []\n    }\n\n\nSample API Call : http://localhost:5000/admin/licensee/insurance?count=10&skip=0",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Trailer Insurance List\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/licensees/getTrailerInsurance.js",
    "groupTitle": "Admin_App_-_LicenseeTrailer"
  },
  {
    "type": "GET",
    "url": "/admin/licensee/servicing",
    "title": "Get Trailer Servicing List",
    "name": "TAAL_-_Get_Trailer_Servicing_List",
    "group": "Admin_App_-_LicenseeTrailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn reque</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Trailers to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Trailers to skip</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /admin/licensee/servicing</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Successfully fetched Trailer Servicing List\",\n        servicingList: []\n    }\n\n\nSample API Call : http://localhost:5000/admin/licensee/servicing?count=10&skip=0",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Trailer Servicing List\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/licensees/getTrailerServicing.js",
    "groupTitle": "Admin_App_-_LicenseeTrailer"
  },
  {
    "type": "PUT",
    "url": "/admin/licensee/verify/insurance",
    "title": "Save Insurance Document Verification details",
    "name": "TAAL_-_Save_Insurance_Document_Verification_details",
    "group": "Admin_App_-_LicenseeTrailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "insuranceId",
            "description": "<p>Id of the Insurance record, for edit request only</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "isAccepted",
            "description": "<p>Whether Insurance Document is Accepted</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Insurance Document Verification details</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while saving Insurance Document Verification details\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n\n{\n     success: true,\n     message: \"Successfully saved Insurance Document Verification details\"\n}",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/licensees/verifyInsuranceDocument.js",
    "groupTitle": "Admin_App_-_LicenseeTrailer"
  },
  {
    "type": "PUT",
    "url": "/admin/licensee/verify/servicing",
    "title": "Save Servicing Document Verification details",
    "name": "TAAL_-_Save_Servicing_Document_Verification_details",
    "group": "Admin_App_-_LicenseeTrailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "servicingId",
            "description": "<p>Id of the Servicing record, for edit request only</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "isAccepted",
            "description": "<p>Whether Servicing Document is Accepted</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Servicing Document Verification details</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while saving Servicing Document Verification details\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n\n{\n     success: true,\n     message: \"Successfully saved Servicing Document Verification details\"\n}",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/licensees/verifyServicingDocument.js",
    "groupTitle": "Admin_App_-_LicenseeTrailer"
  },
  {
    "type": "GET",
    "url": "/admin/customer/payments",
    "title": "Get Customer Payment List",
    "name": "TAAT_-_Get_Customer_Payment_List",
    "group": "Admin_App_-_Payments",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Trailers to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Trailers to skip</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /admin/customer/payments</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Successfully fetched Customer Payments List\",\n        licenseeList: []\n    }\n\n\nSample API Call : http://localhost:5000/admin/customer/payments?count=10&skip=0",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Customer Payment List\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/trailers/getCustomerPayments.js",
    "groupTitle": "Admin_App_-_Payments"
  },
  {
    "type": "GET",
    "url": "/admin/licensee/payouts",
    "title": "Get Licensee Payout List",
    "name": "TAAT_-_Get_Licensee_Payout_List",
    "group": "Admin_App_-_Payments",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn reque</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Trailers to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Trailers to skip</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /admin/licensee/payouts</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Successfully fetched Licensee Payout List\",\n        licenseeList: []\n    }\n\n\nSample API Call : http://localhost:5000/admin/licensee/payouts?count=10&skip=0",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Licensee Payout List\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/trailers/getLicenseePayouts.js",
    "groupTitle": "Admin_App_-_Payments"
  },
  {
    "type": "GET",
    "url": "/featured",
    "title": "Get Featured Trailers and Upsell Items",
    "name": "TAAT_-_Get_Featured_Trailers_and_Upsell_Items",
    "group": "Admin_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /featured</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        trailers: []\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Couldn't get trailers\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/trailers/getFeatured.js",
    "groupTitle": "Admin_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/rentalitemtype",
    "title": "Get Rental Item Types List",
    "name": "TAAT_-_Get_Rental_Item_Types_List",
    "group": "Admin_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of the Rental Item</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /rentalitemtype</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        rentalItemType: {}\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Couldn't get Rental Item Type\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/trailers/getRentalItemType.js",
    "groupTitle": "Admin_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/rentalitemtypes",
    "title": "Get Rental Item Types List",
    "name": "TAAT_-_Get_Rental_Item_Types_List",
    "group": "Admin_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /rentalitemtypes</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        rentalItemTypes: []\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Couldn't get Rental Item Types\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/trailers/getRentalItemTypes.js",
    "groupTitle": "Admin_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/admin/trailer",
    "title": "Get Trailer Type Details",
    "name": "TAAT_-_Get_Trailer_Type_Details",
    "group": "Admin_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Trailer Id</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /admin/trailer</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        trailerObj: []\n    }\n\nSample API Call : http://localhost:5000/admin/trailer?id=",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Trailer Type data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/trailers/getTrailer.js",
    "groupTitle": "Admin_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/admin/trailers",
    "title": "Get Trailer Type List",
    "name": "TAAT_-_Get_Trailer_Type_List",
    "group": "Admin_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Trailers to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Trailers to skip</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /admin/trailers</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        trailersList: []\n    }\n\nSample API Call : http://localhost:5000/admin/trailers?count=5&skip=0",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Trailer Types data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/trailers/getTrailers.js",
    "groupTitle": "Admin_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/commissions",
    "title": "Get Trailer or Upsell Item Commission data",
    "name": "TAAT_-_Get_Trailer_or_Upsell_Item_Commission_data",
    "group": "Admin_App_-_Trailer",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Type of Item - &quot;trailer&quot; or &quot;upsellitem&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Commission data to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Commission data to skip</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /commissions data</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Successfully fetched Commission data\",\n        commissionsList: [\n            {\n                _id: '5e4fa796c6091d40ee15aa91',\n                itemId: '5e4fa796c6091d40ee15aa8f',\n                itemType: 'trailer',\n                chargeType: 'flat',\n                charge: 10\n            },\n            {\n                _id: '5e4fa796c6091d40ee15aa91',\n                itemId: '5e4fa796c6091d40ee15aa8f',\n                itemType: 'trailer',\n                chargeType: 'percentage',\n                charge: 10\n            }\n        ]\n    }\n\nSample API Call : http://localhost:5000/commissions?type=trailer&count=5&skip=0",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Commission data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/trailers/getCommissions.js",
    "groupTitle": "Admin_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/admin/upsellitem",
    "title": "Get Upsell Item Type Details",
    "name": "TAAT_-_Get_Upsell_Item_Type_Details",
    "group": "Admin_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Trailer Id</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /admin/upsellitem</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        upsellItemObj: []\n    }\n\nSample API Call : http://localhost:5000/admin/upsellitem?id=",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Upsell Item Type data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/trailers/getUpsellItem.js",
    "groupTitle": "Admin_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/admin/upsellitems",
    "title": "Get Upsell Item Type List",
    "name": "TAAT_-_Get_Upsell_Item_Type_List",
    "group": "Admin_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Trailers to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Trailers to skip</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /admin/upsellitems</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        upsellItemsList: []\n    }\n\nSample API Call : http://localhost:5000/admin/upsellitems?count=5&skip=0",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Upsell Item Types data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/trailers/getUpsellItems.js",
    "groupTitle": "Admin_App_-_Trailer"
  },
  {
    "type": "POST",
    "url": "/commission",
    "title": "Save Commission for Trailers or Upsell Items",
    "name": "TAAT_-_Save_Commission_for_Trailers_or_Upsell_Items",
    "group": "Admin_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "itemType",
            "description": "<p>Type of item - &quot;trailer&quot; or &quot;upsellitem&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "itemId",
            "description": "<p>Id of the Trailer/UpsellItem for which is rated by the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "chargeType",
            "description": "<p>Type of Commission - &quot;flat&quot; or &quot;percentage&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "charge",
            "description": "<p>Commission Value - flat or percentage</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Commission for Trailers or Upsell Items</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while saving Commission record\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n{\n     success: true,\n     message: \"Successfully saved Commission record\",\n     commissionObj: {\n            _id: '5e4fa796c6091d40ee15aa91',\n            itemId: '5e4fa796c6091d40ee15aa8f',\n            itemType: 'trailer',\n            chargeType: 'flat',\n            charge: 10\n     }\n}",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/trailers/saveCommission.js",
    "groupTitle": "Admin_App_-_Trailer"
  },
  {
    "type": "POST",
    "url": "/admin/upsellitem",
    "title": "Save Upsell Item data",
    "name": "TAAT_-_Save_Upsell_Item_data",
    "group": "Admin_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "FilesArray",
            "optional": false,
            "field": "photos",
            "description": "<p>Photos of the Upsell Item ( Files )</p>"
          },
          {
            "group": "Parameter",
            "type": "FilesArray",
            "optional": false,
            "field": "rates",
            "description": "<p>Upsell Item Rental Rates based on time period ( File )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the Upsell Item</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Type of the Upsell Item</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the Upsell Item</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "availability",
            "description": "<p>Make trailer Available to be rented?</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "isFeatured",
            "description": "<p>Is this a featured trailer?</p>"
          },
          {
            "group": "Parameter",
            "type": "Double",
            "optional": false,
            "field": "rentalCharges",
            "description": "<p>Rental Charges of the Upsell Item OR rates file</p>"
          },
          {
            "group": "Parameter",
            "type": "Double",
            "optional": false,
            "field": "dlrCharges",
            "description": "<p>DLR ( Damage Liability Reduction ) Charges of the Upsell Item</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Upsell Item</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error while saving Upsell Item\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n\n{\n     success: true,\n     message: \"Successfully saved Upsell Item\"\n}",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/trailers/saveUpsellItem.js",
    "groupTitle": "Admin_App_-_Trailer"
  },
  {
    "type": "POST",
    "url": "/admin/rentalitemtype",
    "title": "Save or Update Rental Item Type",
    "name": "TAAT_-_Save_or_Update_Rental_Item_Type",
    "group": "Admin_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of the record ( for update request )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the Rental Item Type</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>Unique Code of the Rental Item</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "itemtype",
            "description": "<p>Type of the Rental Item ( &quot;trailer&quot; || &quot;upsellitem&quot; )</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint that can used to save or update Rental Item Type</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Token is invalid.\"\"\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/trailers/saveRentalItemType.js",
    "groupTitle": "Admin_App_-_Trailer"
  },
  {
    "type": "POST",
    "url": "/admin/trailer",
    "title": "Save or Update Trailer Information",
    "name": "TAAT_-_Save_or_Update_Trailer_Information",
    "group": "Admin_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "FilesArray",
            "optional": false,
            "field": "photos",
            "description": "<p>Photos of the Trailer ( Files )</p>"
          },
          {
            "group": "Parameter",
            "type": "FilesArray",
            "optional": false,
            "field": "rates",
            "description": "<p>Trailer Rental Rates based on time period ( File )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the Trailer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Type of the Trailer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the Trailer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "size",
            "description": "<p>Size of the Trailer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "capacity",
            "description": "<p>Capacity of the Trailer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "tare",
            "description": "<p>Tare of the Trailer ( Weight of the Trailer before loading goods )</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "availability",
            "description": "<p>Make trailer Available to be rented?</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "isFeatured",
            "description": "<p>Is this a featured trailer?</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "features",
            "description": "<p>Features of the Trailer</p>"
          },
          {
            "group": "Parameter",
            "type": "Double",
            "optional": false,
            "field": "rentalCharges",
            "description": "<p>Rental Charges of the Trailer OR rates file</p>"
          },
          {
            "group": "Parameter",
            "type": "Double",
            "optional": false,
            "field": "dlrCharges",
            "description": "<p>DLR ( Damage Liability Reduction ) Charges of the Trailer</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint that can used to save or update Trailer data</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n\n   {\n        success: false,\n        message: \"Error while saving Trailer record\",\n        errorsList: []\n   }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 \n\n   {\n        success: true,\n        message: \"Successfully saved Trailer record\",\n        trailerObj: {\n            _id: ObjectId(\"5e4132b4603c2159b3e58ac0\"),\n            name: \"2020 C&B DMP610-6TA 26\\\"\",\n            type: \"dump\",\n            description:\n                \"2 5/16\\\" ADJUSTABLE COUPLER, 8000# JACK, LOOSE RAMPS, SCISSOR HOIST\",\n            size: \"Length: 10' Width: 6'\",\n            capacity: \"6980 lbs\",\n            tare: \"2920 lbs\",\n\n            features: [\"2 5/16\\\" ADJUSTABLE COUPLER\",\"8000# JACK\",\"LOOSE RAMPS\",\"SCISSOR HOIST\",\"26\\\" SIDES\",\"STAKE POCKETS\",\"LED LIGHTS\",\"HD FENDERS\"],\n\n            rentalCharges: {\n                pickUp: [\n                    {\n                        duration: 21600000,\n                        charges: 54\n                    },\n                    {\n                        duration: 32400000,\n                        charges: 69\n                    },\n                    {\n                        duration: 1,\n                        charges: 5\n                    }\n                ],\n                door2Door: [\n                    {\n                        duration: 21600000,\n                        charges: 65\n                    },\n                    {\n                        duration: 32400000,\n                        charges: 83\n                    },\n                    {\n                        duration: 1,\n                        charges: 6\n                    }\n                ]\n            },\n            dlrCharges: 400\n        }\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/trailers/saveTrailer.js",
    "groupTitle": "Admin_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/admin/rentals",
    "title": "Get Trailer or Upsell Item Rental or Upsell Item Buy Request data",
    "name": "TAAT_-_Get_Trailer_or_Upsell_Item_Rental_or_Upsell_Item_Buy_Request_data",
    "group": "Admin_App_-_Trailer_Rental",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bookedByUserId",
            "description": "<p>Booked by User Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Rentals data to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Rentals data to skip</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "upcoming",
            "description": "<p>Do fetch Upcoming data or Past data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Type of Rental Request - &quot;rental&quot;, &quot;extension&quot;, &quot;reschedule&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "approved",
            "description": "<p>Whether to fetch approved Rental, Extension, Rescheduling requests</p>"
          }
        ]
      }
    },
    "description": "<p>Get Trailer or Upsell Item Rental or Upsell Item Buy Requests</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Successfully fetched Rental Request\",\n        requestList: [{\n            \n            // For Rentals, Extension and Reschedule Requests\n            rentalId: <String>, // ID of the Rental\n            rentedItem: <String>, // Rented Item - trailer or upsellitem\n            rentedItemId: <String>, // ID of the Rented Item\n            rentedItemName: <String>, // Name of the Rented Item\n            rentedItemPhoto: <String>, // Link\n            licenseeName: <String>,\n            customerId: <String>,\n            customerName: <String>,\n\n            // For Extension Requests\n            extendTill: <Date>,\n            isApproved: <Integer>, // 0 - Pending, 1 - Approved, 2 - Rejected\n            requestOn: <Date>,\n            requestUpdatedOn: <Date>\n\n            // For Reschedule Requests\n            scheduleStart: <Date>,\n            scheduleEnd: <Date>,\n            isApproved: <Integer>, // 0 - Pending, 1 - Approved, 2 - Rejected\n            requestOn: <Date>,\n            requestUpdatedOn: <Date>\n        }]\n    }\n\nSample API Call : http://localhost:5000/rentals?count=5&skip=0",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "\nHTTP/1.1 500\n{\n    success: false,\n    message: \"Error occurred while fetching Rental Requests\",\n    errorsList: [\"Error occurred while fetching Rental Requests\"]\n}\n\nHTTP/1.1 400\n{\n    success: false,\n    message: \"Missing Licensee ID\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/trailers/getRentals.js",
    "groupTitle": "Admin_App_-_Trailer_Rental"
  },
  {
    "type": "PUT",
    "url": "/admin/rental/approval",
    "title": "Save Rental Request Approval data",
    "name": "TAAT_-_Save_Rental_Request_Approval_data",
    "group": "Admin_App_-_Trailer_Rental",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "rentalId",
            "description": "<p>Rental Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "revisionId",
            "description": "<p>Id of Rental Revision</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "approvalStatus",
            "description": "<p>Approval Status of the Rental Request</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "NOPAYMENT",
            "description": "<p>Add this parameter when you want to skip payment ( value = true )</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Rental Request Approval</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "\nHTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while approving/rejecting Rental Request\",\n     errorsList: []\n }\n\n HTTP/1.1 400 \n {\n     success: false,\n     message: \"Error in Stripe Payments\",\n     error: \"authentication_required\",\n     paymentMethod: err.raw.payment_method.id,\n     clientSecret: err.raw.payment_intent.client_secret,\n     amount: amountToCharge,\n     card: {\n         brand: err.raw.payment_method.card.brand,\n         last4: err.raw.payment_method.card.last4\n     }\n }\n\n HTTP/1.1 400\n {\n     success: false,\n     message: \"Error in Stripe Payments\",\n     error: err.code,\n     clientSecret: err.raw.payment_intent.client_secret\n }\n\n HTTP/1.1 400\n {\n     success: false,\n     message: \"Error in Stripe Payments\",\n     error: err\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\"\n        // message: \"Successfully approved/rejected Rental Extension Request\"\n        // message: \"Successfully approved/rejected Rental Reschedule Request\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/admin/trailers/manageRentalApproval.js",
    "groupTitle": "Admin_App_-_Trailer_Rental"
  },
  {
    "type": "GET",
    "url": "/file/:source/:id/:index",
    "title": "Get Files stored in the database",
    "name": "Get_Files_stored_in_the_database",
    "group": "Common",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "source",
            "description": "<p>source of a file - trailer, upsellitem, trailertype, upsellitemtype, trailerservicing, trailerinsurance, userphoto, userdrivinglicense, licenseelogo, licenseeproof, lempl-photo, lempl-drivinglicense, lempl-additionaldoc</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the source document</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "index",
            "description": "<p>Index of a File</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /file/:source/:id/:index</p>",
    "success": {
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching a File\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/common/getFiles.js",
    "groupTitle": "Common"
  },
  {
    "type": "GET",
    "url": "/user/reminders",
    "title": "Get Booking Reminders for a User",
    "name": "CA_-_Get_Booking_Reminders_for_a_User",
    "group": "Customer_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint that can used to get Booking Reminders for a User</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n\n    {\n        success: false,\n        message: \"Error occurred while fetching Booking Reminders for a User\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "remindersList",
            "description": "<p>List of Reminders</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 \n\n    {\n        success: true,\n        message: \"Success\",\n        remindersList: [\n            {\n                \"name\": \"Painted Tandem\",\n                \"photo\": \"url\",\n                \"licenseeName\": \"Licensee One\",\n                \"reminderType\": \"upcoming\",\n                \"reminderText\": \"4 days to receive\",\n                \"reminderColor\": \"#00BE75\"\n            }\n        ]\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/getReminders.js",
    "groupTitle": "Customer_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/featured",
    "title": "Get Featured Trailers and Upsell Items",
    "name": "CA_-_Get_Featured_Trailers_and_Upsell_Items",
    "group": "Customer_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /featured</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "trailers",
            "description": "<p>Array of Featured Trailers</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        trailers: []\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not get trailers\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/getFeatured.js",
    "groupTitle": "Customer_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/rentalitemfilters",
    "title": "Get Filters List",
    "name": "CA_-_Get_Filters_List",
    "group": "Customer_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /rentalitemfilters</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "filtersObj",
            "description": "<p>Object of Filters</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "trailerTypesList",
            "description": "<p>List of Trailer Types</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "upsellItemTypesList",
            "description": "<p>List of Upsell Items Types</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "deliveryTypeList",
            "description": "<p>List of Delivery Types</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        filtersObj: {\n            trailerTypesList: [],\n            upsellItemTypesList: [],\n            deliveryTypeList: []\n        }\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not get Rental Item Filters\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/getFilters.js",
    "groupTitle": "Customer_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/rental/notifications",
    "title": "Get Notifications List",
    "name": "CA_-_Get_Notifications_List",
    "group": "Customer_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Notifications to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Notifications to skip</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /rental/notifications</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "notificationsList",
            "description": "<p>List of Notifications</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        notificationsList: []\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not fetch Notifications data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/getNotifications.js",
    "groupTitle": "Customer_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/rentalitemtypes",
    "title": "Get Rental Item Types List",
    "name": "CA_-_Get_Rental_Item_Types_List",
    "group": "Customer_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /rentalitemtypes</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "rentalItemTypes",
            "description": "<p>List of Rental Items</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        rentalItemTypes: []\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not fetch Rental Item Types\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/getRentalItemTypes.js",
    "groupTitle": "Customer_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/trailer",
    "title": "Get Trailer Details",
    "name": "CA_-_Get_Trailer_Details",
    "group": "Customer_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Trailer Id</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /trailer</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "trailerObj",
            "description": "<p>Object of Trailer</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 \n\n    {\n        success: true,\n        message: \"Success\",\n        trailerObj: {\n            \"features\": [\n                \"spacious\"\n            ],\n            \"photos\": [],\n            \"availability\": true,\n            \"_id\": \"5e3bea14d3389b3ec15be4f2\",\n            \"name\": \"Shadow Trailer\",\n            \"type\": \"cargo\",\n            \"description\": \"-83 IN WIDE -TANDEM 5200# TORSION AXLES -ALL ALUMINUM -RUBBER BUMPER \",\n            \"size\": \"38??? floor x 8??? tall x 8???5 wide\",\n            \"capacity\": \"6680\",\n            \"age\": 3,\n            \"tare\": \"5200\",\n            \"licenseeId\": \"5e395d2f784ae3441c9486bc\",\n            \"rating\": \"3\",\n            \"rentalCharges\": {\n                \"pickUp\": [\n                    {\n                        \"duration\": 21600000,\n                        \"charges\": 54\n                    },\n                    {\n                        \"duration\": 1,\n                        \"charges\": 5\n                    }\n                ],\n                \"door2Door\": [\n                    {\n                        \"duration\": 21600000,\n                        \"charges\": 65\n                    },\n                    {\n                        \"duration\": 1,\n                        \"charges\": 6\n                    }\n                ]\n            },\n            \"price\": \"$86\",\n            \"rentalsList\": [\n                {\n                    \"start\": '2020-06-05T00:00:00.000+00:00',\n                    \"end\": '2020-06-07T00:00:00.000+00:00'\n                }\n            ]\n        }\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not fetch Trailer data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/getTrailer.js",
    "groupTitle": "Customer_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/trailer/licensee",
    "title": "Get Trailer Licensee Details",
    "name": "CA_-_Get_Trailer_Licensee_Details",
    "group": "Customer_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Licensee Id</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /trailer/licensee</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "licenseeObj",
            "description": "<p>Licensee Object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 \n    {\n        success: true,\n        message: \"Success\",\n        licenseeObj: {}\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not fetch Licensee data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/viewTrailerLicensee.js",
    "groupTitle": "Customer_App_-_Trailer"
  },
  {
    "type": "POST",
    "url": "/trailer/view",
    "title": "Get Trailer View Details",
    "name": "CA_-_Get_Trailer_View_Details",
    "group": "Customer_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Trailer Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>Address of the location  [latitude, longitude]</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "dates",
            "description": "<p>Range Array [&quot;Start Date&quot;, &quot;End Date&quot;]</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "times",
            "description": "<p>Range Array [&quot;Start Time&quot;, &quot;End Time&quot;]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "delivery",
            "description": "<p>Type of Delivery ( &quot;door2door&quot; || &quot;pickup&quot; ) ( default - &quot;door2door&quot; )</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint POST /trailer/view</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "trailerObj",
            "description": "<p>Trailer Object</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "trailers",
            "description": "<p>List of Upsell Item Objects</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "licenseeObj",
            "description": "<p>Licensee Object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 \n\n    {\n        success: true,\n        message: \"Success\",\n        trailerObj: {},\n        upsellItemsList: [],\n        licenseeObj: {}\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not fetch Trailer data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/viewTrailer.js",
    "groupTitle": "Customer_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/trailers",
    "title": "Get Trailers List",
    "name": "CA_-_Get_Trailers_List",
    "group": "Customer_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Trailers to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Trailers to skip</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pincode",
            "description": "<p>Pincodes separated by comma</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Address of the location</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>Location in the format &quot;latitude,longitude&quot; ( e.g. location=43.8477,-111.6932 )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "isFeatured",
            "description": "<p>Boolean representing whether a trailer is featured</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "isAvailable",
            "description": "<p>Boolean representing whether a trailer is available</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>String to search for in name field</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>String to search for in description field</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "size",
            "description": "<p>String to search for in size field</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "capacity",
            "description": "<p>String to search for in capacity field</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "features",
            "description": "<p>String to search for in features field</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licenseeId",
            "description": "<p>String to search for in features field</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /trailers</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "trailersList",
            "description": "<p>List of Trailer objects</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        trailersList: []\n    }\n\nSample API Call : http://localhost:5000/trailers?count=5&skip=0&pincode=83448,1560&location=43.8477,-111.6932",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not fetch Trailers data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/getTrailers.js",
    "groupTitle": "Customer_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/trailers/admin",
    "title": "Get Trailers added by Admin",
    "name": "CA_-_Get_Trailers_added_by_Admin",
    "group": "Customer_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /trailers/admin</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "trailersList",
            "description": "<p>List of Admin Trailer Objects</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        trailersList: []\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not fetch Admin Trailer Type\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/getAdminTrailers.js",
    "groupTitle": "Customer_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/upsellitems/admin",
    "title": "Get UpsellItems added by Admin",
    "name": "CA_-_Get_UpsellItems_added_by_Admin",
    "group": "Customer_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /upsellitems/admin</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "upsellItemsList",
            "description": "<p>List of Admin Upsell Item Objects</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        upsellItemsList: []\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not fetch Admin Upsell Item Type\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/getAdminUpsellItems.js",
    "groupTitle": "Customer_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/upsellitem",
    "title": "Get Upsell Item Details",
    "name": "CA_-_Get_Upsell_Item_Details",
    "group": "Customer_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Upsell Item Id</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /upsellitem</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "upsellItemObj",
            "description": "<p>Upsell Item object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 \n\n    {\n        success: true,\n        message: \"Success\",\n        upsellItemObj: {\n            availability: true,\n            _id: '5e4fd5f6286df95cfbea5b09',\n            name: \"Trailers 2000 6 x 4' Universal Tonneau Cover\",\n            description: 'Universal tonneau covers are tough and made to suit most standard size 6 x 4 box trailers.This easy to fit cover is ideal for protecting against dust and water, the kit contains the cover, bow and buttons for securing the cover to the trailer',\n            rentalCharges: {\n                \"pickUp\": [\n                    {\n                        \"duration\": 21600000,\n                        \"charges\": 54\n                    },\n                    {\n                        \"duration\": 1,\n                        \"charges\": 5\n                    }\n                ],\n                \"door2Door\": [\n                    {\n                        \"duration\": 21600000,\n                        \"charges\": 65\n                    },\n                    {\n                        \"duration\": 1,\n                        \"charges\": 6\n                    }\n                ]\n            }\n            trailerId: '5e4fd5f6286df95cfbea5b07',\n            photos: [\"{HOST}/file/upsellitem/:trailerId/:photoIndex\"],\n            rating: '0/5'\n        }\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not fetch Upsell Item data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/getUpsellItem.js",
    "groupTitle": "Customer_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/upsellitems",
    "title": "Get Upsell Items List",
    "name": "CA_-_Get_Upsell_Items_List",
    "group": "Customer_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "trailerId",
            "description": "<p>Id of the Trailer for which Upsell Items have to be fetched</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Upsell Items to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Upsell Items to skip</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Address of the location</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pincode",
            "description": "<p>Pincodes separated by comma</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>Location in the format &quot;latitude,longitude&quot; ( e.g. location=43.8477,-111.6932 )</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /upsellitems</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "upsellItemsList",
            "description": "<p>List of Upsell Item objects</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        upsellItemsList: []\n    }\n\nSample API Call : http://localhost:5000/upsellitems?count=5&skip=0&pincode=83448,1560&location=-111.6932,43.8477",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not fetch Upsell Items data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/getUpsellItems.js",
    "groupTitle": "Customer_App_-_Trailer"
  },
  {
    "type": "POST",
    "url": "/rating",
    "title": "Save Ratings data",
    "name": "CA_-_Save_Ratings_data",
    "group": "Customer_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "itemType",
            "description": "<p>Type of Item for which Rating is saved - &quot;trailer&quot; or &quot;upsellitem&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "itemId",
            "description": "<p>Id of the Trailer for which is rated by the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ratedByUserId",
            "description": "<p>Id of the User who has rated the Trailer</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "ratingValue",
            "description": "<p>Value of the Rating</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Trailer Ratings</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Could not save Ratings record\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n{\n     success: true,\n     message: \"Success\"\n}",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/saveRatings.js",
    "groupTitle": "Customer_App_-_Trailer"
  },
  {
    "type": "POST",
    "url": "/review",
    "title": "Save Reviews data",
    "name": "CA_-_Save_Reviews_data",
    "group": "Customer_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "trailerId",
            "description": "<p>Id of the Trailer for which is reviewed by the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "reviewedByUserId",
            "description": "<p>Id of the User who has reviewed the Trailer</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "reviewText",
            "description": "<p>Review written by the User</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Trailer Reviews</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Could not save Review record\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n{\n     success: true,\n     message: \"Success\"\n}",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/saveReviews.js",
    "groupTitle": "Customer_App_-_Trailer"
  },
  {
    "type": "POST",
    "url": "/search",
    "title": "Search Trailers",
    "name": "CA_-_Search_Trailers",
    "group": "Customer_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of records ( default - 5 )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of records ( default - 0 )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>Address of the location [latitude, longitude]</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "dates",
            "description": "<p>Range Array [&quot;Start Date&quot;, &quot;End Date&quot;] ( &quot;DD MMM, YYYY&quot; )</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "times",
            "description": "<p>Range Array [&quot;Start Time&quot;, &quot;End Time&quot;] ( &quot;DD MMM, YYYY&quot; )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "delivery",
            "description": "<p>Type of Delivery ( &quot;door2door&quot; || &quot;pickup&quot; ) ( default - &quot;door2door&quot; )</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "type",
            "description": "<p>Type of Rental Item</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint POST /search</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "trailers",
            "description": "<p>List of Trailer Objects</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        trailers: [\n            {\n                rentalItemId: \"\",\n                name: \"Tuffmate\",\n                type: \"cage-trailer\",\n                price: \"120.55 AUD\",\n                photo: \"<Link to Photo>\",\n                licenseeId: \"\",\n                licenseeName: \"Licensee 1\",\n                rating: 4,\n                rentalItemType: \"trailer\",\n\n                upsellItems: [\n                    {\n                        rentalItemId: \"\",\n                        name: \"Aluminium Folding Ramps\",\n                        type: \"aluminium-ramps\",\n                        price: \"20.55 AUD\",\n                        photo: \"<Link to Photo>\",\n                        licenseeId: \"\",\n                        licenseeName: \"Licensee 1\",\n                        rating: 3,\n                        rentalItemType: \"upsellitem\",\n                    }\n                ]\n            }\n        ]\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not get trailers\"\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/searchRentalItems.js",
    "groupTitle": "Customer_App_-_Trailer"
  },
  {
    "type": "POST",
    "url": "/save-customer",
    "title": "Create Customer on Stripe",
    "name": "CA_-_Create_Customer_on_Stripe",
    "group": "Customer_App_-_Trailer_Rental",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to Create Customer on Stripe</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Could not create a Customer\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "customer",
            "description": "<p>Stripe Customer Id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "clientSecret",
            "description": "<p>Client Secret for Payment Intent Setup</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        customer: \"AB12CD34\",\n        clientSecret: \"ABCD1234\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/user/createPaymentCustomer.js",
    "groupTitle": "Customer_App_-_Trailer_Rental"
  },
  {
    "type": "POST",
    "url": "/create-payment-intent",
    "title": "Create Payment Intent",
    "name": "CA_-_Create_Payment_Intent",
    "group": "Customer_App_-_Trailer_Rental",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "totalAmount",
            "description": "<p>Total Amount</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "invoiceNumber",
            "description": "<p>Invoice Number</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to create Payment Intent</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Could not create Payment Intent\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "clientSecret",
            "description": "<p>Client Secret</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        clientSecret: \"ABCD1234\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/createPaymentIntent.js",
    "groupTitle": "Customer_App_-_Trailer_Rental"
  },
  {
    "type": "GET",
    "url": "/user/rental/locations",
    "title": "Get Rental Item Locations",
    "name": "CA_-_Get_Rental_Item_Locations",
    "group": "Customer_App_-_Trailer_Rental",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn reque</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "rentalId",
            "description": "<p>ID of the Rental Record for which Rental has to be tracked</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Tracking for &quot;pickup&quot; or &quot;dropoff&quot;</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to get Rental Item Locations</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Rental Item Location\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "isTracking",
            "description": "<p>Is Tracking</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "locationsList",
            "description": "<p>List of Locations</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully fetched Rental Item Location\",\n        \"locationsList\": [\n            {\n                \"location\": [151.2172, 33.8131],\n                \"_id\": \"5e6f799914cad8421359187b\",\n                \"rentalId\": \"5e6893b03decce1dfd118021\",\n                \"createdAt\": \"2020-03-16T13:05:29.121Z\",\n                \"__v\": 0\n            },\n            {\n                \"location\": [150.2172, 32.8131],\n                \"_id\": \"5e6f7acfeed91842de605e9e\",\n                \"rentalId\": \"5e6893b03decce1dfd118021\",\n                \"createdAt\": \"2020-03-16T13:10:39.934Z\",\n                \"__v\": 0\n            }\n        ]\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/getRentalItemLocation.js",
    "groupTitle": "Customer_App_-_Trailer_Rental"
  },
  {
    "type": "GET",
    "url": "/trailer/:id/rentalcharges",
    "title": "Get Trailer Rental Charges",
    "name": "CA_-_Get_Trailer_Rental_Charges",
    "group": "Customer_App_-_Trailer_Rental",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Trailer Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "trailerObj",
            "description": "<p>Object of Trailer</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "rentalCharges",
            "description": "<p>Rental Charges for a Trailer</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 \n\n    {\n        success: true,\n        message: \"Success\",\n        rentalCharges: {\n            pickUp: [ {\n                duration: <Number>, // Duration in milliseconds\n                charges: <Number> // Charges\n            } ],\n            door2Door: [ {\n                duration: <Number>, // Duration in milliseconds\n                charges: <Number> // Charges\n            } ]\n        }\n    }",
          "type": "String"
        }
      ]
    },
    "description": "<p>API Endpoint GET /trailer/{id}/rentalcharges</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not fetch Trailer Rental Charges\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/getTrailerRentalCharges.js",
    "groupTitle": "Customer_App_-_Trailer_Rental"
  },
  {
    "type": "GET",
    "url": "/rental",
    "title": "Get Trailer or Upsell Item Rental or Upsell Item Buy data",
    "name": "CA_-_Get_Trailer_or_Upsell_Item_Rental_or_Upsell_Item_Buy_data",
    "group": "Customer_App_-_Trailer_Rental",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the Rental Data to fetch</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /rental data</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "rentalObj",
            "description": "<p>Rental Object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        rentalObj: {}\n    }\n\nSample API Call : http://localhost:5000/rental?id=122hgd3232gdh",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not fetch Invoice Detail\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/getCartItem.js",
    "groupTitle": "Customer_App_-_Trailer_Rental"
  },
  {
    "type": "GET",
    "url": "/rentals",
    "title": "Get Trailer or Upsell Item Rental or Upsell Item Buy data",
    "name": "CA_-_Get_Trailer_or_Upsell_Item_Rental_or_Upsell_Item_Buy_data",
    "group": "Customer_App_-_Trailer_Rental",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Rentals data to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Rentals data to skip</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "upcoming",
            "description": "<p>Do fetch Upcoming data or Past Data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "itemId",
            "description": "<p>Trailer ID or Upsell Item ID</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /rentals data</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "rentalsList",
            "description": "<p>Array of Rental Objects</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        rentalsList: []\n    }\n\nSample API Call : http://localhost:5000/rentals?count=5&skip=0",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not fetch Invoices List\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/getCartItems.js",
    "groupTitle": "Customer_App_-_Trailer_Rental"
  },
  {
    "type": "PUT",
    "url": "/invoice/transaction/action",
    "title": "Save Details of Transaction Action for Rental Item",
    "name": "CA_-_Save_Details_of_Transaction_Action_for_Rental_Item",
    "group": "Customer_App_-_Trailer_Rental",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "invoiceId",
            "description": "<p>Invoice Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "actionType",
            "description": "<p>Action Type = &quot;capture&quot; || &quot;cancel&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "transId",
            "description": "<p>Access Code/Transaction Id of the Transaction</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "amount",
            "description": "<p>Amount Captured</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Invoice Transaction Action ( Capture or Cancel ) data</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not save Transaction Action ( Capture or Cancel ) data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/saveInvoiceTransactionAction.js",
    "groupTitle": "Customer_App_-_Trailer_Rental"
  },
  {
    "type": "PUT",
    "url": "/invoice/transaction",
    "title": "Save Details of Transaction Authorisation for Rental Item",
    "name": "CA_-_Save_Details_of_Transaction_Authorisation_for_Rental_Item",
    "group": "Customer_App_-_Trailer_Rental",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "invoiceId",
            "description": "<p>Invoice Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "transId",
            "description": "<p>Access Code/Transaction Id of the Transaction</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Invoice Transaction data</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not save Transaction data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/saveInvoiceTransaction.js",
    "groupTitle": "Customer_App_-_Trailer_Rental"
  },
  {
    "type": "POST",
    "url": "/invoice",
    "title": "Save Invoice data",
    "name": "CA_-_Save_Invoice_data",
    "group": "Customer_App_-_Trailer_Rental",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "objRental",
            "description": "<p>Object defining Rental data</p> <pre><code>{     description: &lt;String&gt;,      licenseeId: &lt;ObjectId&gt;, //  Licensee Id     rentedItems: [          {             itemType: &lt;String&gt;, // &quot;trailer&quot;, &quot;upsellitem&quot;             itemId: &lt;String&gt;, // trailerId, upsellItemId,             units: &lt;Number&gt; // units         }     ],     rentalPeriod: { // required          start: &lt;Date&gt; // required, in format &quot;YYYY-MM-DD HH:MM&quot;         end: &lt;Date&gt; // required, in format &quot;YYYY-MM-DD HH:MM&quot;     },     doChargeDLR: &lt;Boolean&gt; // required     isPickUp: &lt;Boolean&gt; // required ( pickup OR door2door )     pickUpLocation: { // required         text: &lt;String&gt;,         pincode: &lt;String&gt;,         coordinates: [&lt;Latitude - Number&gt;, &lt;Longitude - Number&gt;]     },     dropOffLocation: { // required         text: &lt;String&gt;,         pincode: &lt;String&gt;,         coordinates: [&lt;Latitude - Number&gt;, &lt;Longitude - Number&gt;]     } }</code></pre>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Invoice data</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Could not save Invoice data\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "invoiceObj",
            "description": "<p>Invoice object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\",\n        invoiceObj: {}\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/saveInvoice.js",
    "groupTitle": "Customer_App_-_Trailer_Rental"
  },
  {
    "type": "POST",
    "url": "/user/rental/location",
    "title": "Save Rental Item Location",
    "name": "CA_-_Save_Rental_Item_Location",
    "group": "Customer_App_-_Trailer_Rental",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "rentalId",
            "description": "<p>Rental/invoice ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>Location Coordinates [latitude, longitude]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Tracking for &quot;pickup&quot; or &quot;dropoff&quot;</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Rental Item Location</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while updating Rental Item Location\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully updated Rental Item Location\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/saveRentalItemLocation.js",
    "groupTitle": "Customer_App_-_Trailer_Rental"
  },
  {
    "type": "POST",
    "url": "/user/rental/location/track",
    "title": "Save Rental Item Location Tracking Start data",
    "name": "CA_-_Save_Rental_Item_Location_Tracking_Start_data",
    "group": "Customer_App_-_Trailer_Rental",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "rentalId",
            "description": "<p>Rental/invoice ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Tracking for &quot;pickup&quot; or &quot;dropoff&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "action",
            "description": "<p>Tracking Action ( &quot;start&quot; or &quot;end&quot; )</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Rental Item Location Tracking Start data</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while saving Rental Item Location Tracking Start data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "locationObj",
            "description": "<p>Location object having pickUpLocation or dropOffLocation</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\",\n        locationObj: {}\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/saveRentalItemLocationStartTracking.js",
    "groupTitle": "Customer_App_-_Trailer_Rental"
  },
  {
    "type": "GET",
    "url": "/cart",
    "title": "Get Shopping Cart Details",
    "name": "CA_-_Get_Shopping_Cart_Details",
    "group": "Customer_App_-_Trailer_Rental_Old",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "cartId",
            "description": "<p>If of the Cart for which the Cart Details have to be fetched</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /cart data</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "cartObj",
            "description": "<p>Cart Object</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "cartItemsList",
            "description": "<p>Cart Items List</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "charges",
            "description": "<p>Total Charges of the Shopping Cart</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Successfully fetched Shopping Cart data\",\n        cartObj: {},\n        cartItemsList: [],\n        charges: {}\n    }\n\nSample API Call : http://localhost:5000/cart?cartId=<Cart ID>",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Shopping Cart data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/getCartDetails.js",
    "groupTitle": "Customer_App_-_Trailer_Rental_Old"
  },
  {
    "type": "POST",
    "url": "/rental/cancel",
    "title": "Save Cancellation for a Trailer or Upsell Item Rental",
    "name": "CA_-_Save_Cancellation_for_a_Trailer_or_Upsell_Item_Rental",
    "group": "Customer_App_-_Trailer_Rental_Old",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "rentalId",
            "description": "<p>Rental/Invoice Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "revisionId",
            "description": "<p>Revision Id ( Required only for Update Request )</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "NOPAYMENT",
            "description": "<p>Add this parameter when you want to skip payment ( value = true )</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Cancellation data for a Trailer or Upsell Item Rental data</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Could not cancel the Rental\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rentalId",
            "description": "<p>Rental Id</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "cancellationObj",
            "description": "<p>Cancellation object</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "rentalObj",
            "description": "<p>Rental/Invoice object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true, \n        message: \"Success\", \n        rentalId: \"\", \n        cancellationObj: {}, \n        rentalObj: {} \n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/saveRentalCancellation.js",
    "groupTitle": "Customer_App_-_Trailer_Rental_Old"
  },
  {
    "type": "PUT",
    "url": "/cart/transaction",
    "title": "Save Details of Transaction",
    "name": "CA_-_Save_Details_of_Transaction",
    "group": "Customer_App_-_Trailer_Rental_Old",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "cartId",
            "description": "<p>Cart Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "transId",
            "description": "<p>Access Code/Transaction Id of the Transaction</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Cart Transaction data</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while saving Cart Transaction data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully saved Cart Transaction data\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/saveCartTransaction.js",
    "groupTitle": "Customer_App_-_Trailer_Rental_Old"
  },
  {
    "type": "PUT",
    "url": "/cart/transaction/action",
    "title": "Save Details of Transaction",
    "name": "CA_-_Save_Details_of_Transaction",
    "group": "Customer_App_-_Trailer_Rental_Old",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "cartId",
            "description": "<p>Cart Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "actionType",
            "description": "<p>Action Type = &quot;capture&quot; || &quot;cancel&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "transId",
            "description": "<p>Access Code/Transaction Id of the Transaction</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "amount",
            "description": "<p>Amount Captured</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Cart Transaction Action ( Capture or Cancel ) data</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while saving Cart Transaction Action ( Capture or Cancel ) data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully saved Cart Transaction Action ( Capture or Cancel ) data\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/saveCartTransactionAction.js",
    "groupTitle": "Customer_App_-_Trailer_Rental_Old"
  },
  {
    "type": "PUT",
    "url": "/rental/transaction/action",
    "title": "Save Details of Transaction Action for Rental Item",
    "name": "CA_-_Save_Details_of_Transaction_Action_for_Rental_Item",
    "group": "Customer_App_-_Trailer_Rental_Old",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "rentalId",
            "description": "<p>Cart/Rental Item Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "actionType",
            "description": "<p>Action Type = &quot;capture&quot; || &quot;cancel&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "transId",
            "description": "<p>Access Code/Transaction Id of the Transaction</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "amount",
            "description": "<p>Amount Captured</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Cart Item or Rental Transaction Action ( Capture or Cancel ) data</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while saving Cart Item or Rental Transaction Action ( Capture or Cancel ) data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully saved Cart Item or Rental Transaction Action ( Capture or Cancel ) data\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/saveCartItemTransactionAction.js",
    "groupTitle": "Customer_App_-_Trailer_Rental_Old"
  },
  {
    "type": "PUT",
    "url": "/rental/transaction",
    "title": "Save Details of Transaction Authorisation for Rental Item",
    "name": "CA_-_Save_Details_of_Transaction_Authorisation_for_Rental_Item",
    "group": "Customer_App_-_Trailer_Rental_Old",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "rentalId",
            "description": "<p>Cart/Rental Item Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "transId",
            "description": "<p>Access Code/Transaction Id of the Transaction</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Cart Item or Rental Transaction data</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully saved Cart Item or Rental Transaction data\"\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while saving Cart Item or Rental Transaction data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/saveCartItemTransaction.js",
    "groupTitle": "Customer_App_-_Trailer_Rental_Old"
  },
  {
    "type": "POST",
    "url": "/rental/extend",
    "title": "Save Extension for a Trailer or Upsell Item Rental",
    "name": "CA_-_Save_Extension_for_a_Trailer_or_Upsell_Item_Rental",
    "group": "Customer_App_-_Trailer_Rental_Old",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "rentalId",
            "description": "<p>Rental/Invoice Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "revisionId",
            "description": "<p>Revision Id ( Required only for Update Request )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "extendTill",
            "description": "<p>Extend Till Date ( &quot;dd MMM, YYYY hh:mm A&quot; format )</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Extension for a Trailer or Upsell Item Rental data</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Could not save Rental Extension record\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rentalId",
            "description": "<p>Rental/Invoice Id</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "extensionObject",
            "description": "<p>Extension object</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "rentalObj",
            "description": "<p>Rental/Invoice Object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\"\n        extensionObject: {},\n        rentalObj: {}\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/saveRentalExtension.js",
    "groupTitle": "Customer_App_-_Trailer_Rental_Old"
  },
  {
    "type": "POST",
    "url": "/rental/reschedule",
    "title": "Save Reschedule Request for a Trailer or Upsell Item Rental",
    "name": "CA_-_Save_Reschedule_Request_for_a_Trailer_or_Upsell_Item_Rental",
    "group": "Customer_App_-_Trailer_Rental_Old",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "rentalId",
            "description": "<p>Rental/Invoice Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "revisionId",
            "description": "<p>Revision Id ( Required only for Update Request )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "start",
            "description": "<p>Start Date ( &quot;YYYY-MM-DD HH:mm&quot; format )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "end",
            "description": "<p>End Date ( &quot;YYYY-MM-DD HH:mm&quot; format )</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Rescheduling data for a Trailer or Upsell Item Rental</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Could not save Trailer Rental Reschedule data\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rentalId",
            "description": "<p>Rental/Invoice ID</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "scheduleObject",
            "description": "<p>Schedule objects</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "rentalObj",
            "description": "<p>Rental Object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\",\n        rentalId: <String>,\n        scheduleObject: {},\n        rentalObj: {}\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/saveRentalReschedule.js",
    "groupTitle": "Customer_App_-_Trailer_Rental_Old"
  },
  {
    "type": "POST",
    "url": "/rental",
    "title": "Save Trailer or Upsell Item Rental or Upsell Item Buy data",
    "name": "CA_-_Save_Trailer_or_Upsell_Item_Rental_or_Upsell_Item_Buy_data",
    "group": "Customer_App_-_Trailer_Rental_Old",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "objRental",
            "description": "<p>Object defining Rental data</p> <pre><code>{     cartId: &lt;String&gt;, // Id of the Cart if it is available,     transactionType: &lt;String&gt;, // required, rent or buy     rentedItem: &lt;String&gt;, // required, trailer or upsellitem     rentedItemId: &lt;String&gt;, // required, trailerId or upsellItemId      bookedByUserId: &lt;String&gt; // required, userId      units: &lt;Number&gt;, // required only if transactionType is 'buy'      rentalPeriod: { // required only if transactionType is 'rent'         start: &lt;Date&gt; // required, in format &quot;YYYY-MM-DD HH:MM&quot;         end: &lt;Date&gt; // required, in format &quot;YYYY-MM-DD HH:MM&quot;     },      doChargeDLR: &lt;Boolean&gt; // required     hireType: &lt;String&gt; // required, regular OR oneway     isPickUp: &lt;Boolean&gt; // required ( pickup OR door2door )      pickUpLocation: { // required         text: &lt;String&gt;,         pincode: &lt;String&gt;,         location: {              type: &quot;Point&quot;,             coordinates: [&lt;Latitude - Number&gt;, &lt;Longitude - Number&gt;]         }     },     dropOffLocation: { // required         text: &lt;String&gt;,         pincode: &lt;String&gt;,         location: {              type: &quot;Point&quot;,             coordinates: [&lt;Latitude - Number&gt;, &lt;Longitude - Number&gt;]         }     },      isDriverLicenseVerified: &lt;Boolean&gt; // required }</code></pre>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Trailer or Upsell Item Rental or Upsell Item Buy data</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while saving Trailer Rental record\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "cartItemObj",
            "description": "<p>Cart Item object</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "cartObj",
            "description": "<p>Cart object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully saved Trailer Rental record\"\n        cartItemObj: {\n            _id: 5e4fadaa169382447afb27c6,\n            transactionType: 'rent',\n            rentedItem: 'trailer',\n            rentedItemId: 5e4fadaa169382447afb27c1,\n            bookedByUserId: 5e4fadaa169382447afb27c1,\n            rentalPeriod: {\n                start: '2020-06-05T00:00:00.000+00:00',\n                end: '2020-06-07T00:00:00.000+00:00'\n            },\n            totalCharges: {\n                rentalCharges: 134,\n                dlrCharges: 20.099999999999998,\n                t2yCommission: 5.36,\n                discount: 2.68,\n                lateFees: 0\n                total: 162.14\n            },\n            doChargeDLR: true,\n            hireType: 'regular',\n            isPickUp: true,\n            pickUpLocation: {\n                text: 'NorthBridge, NSW, Australia',\n                pincode: '1560',\n                location: { type: 'Point', coordinates: [43.8477,-111.6932] }\n            },\n            dropOffLocation: {\n                text: 'NorthBridge, NSW, Australia',\n                pincode: '1560',\n                location: { type: 'Point', coordinates: [43.8477,-111.6932] }\n            },\n            isDriverLicenseVerified: true,\n            rentalCharges: {\n                \"pickUp\": [\n                    {\n                        \"duration\": 21600000,\n                        \"charges\": 54\n                    },\n                    {\n                        \"duration\": 1,\n                        \"charges\": 5\n                    }\n                ],\n                \"door2Door\": [\n                    {\n                        \"duration\": 21600000,\n                        \"charges\": 65\n                    },\n                    {\n                        \"duration\": 1,\n                        \"charges\": 6\n                    }\n                ]\n            },\n            createdAt: 2020-02-21T10:15:06.425Z,\n            updatedAt: 2020-02-21T10:15:06.426Z,\n            __v: 0\n        },\n        cartObj: {\n            _id: '5e5a5588984b974484c6a0b7',\n            cartItems: [{\n                _id: \"5e5a5588984b974484c6a0b8\",\n                itemId: \"5e5a5588984b974484c6a0b6\",\n                total: 159.1\n            }],\n            total: 159.1,\n            createdAt: '2020-02-29T12:14:00.391Z',\n            updatedAt: '2020-02-29T12:14:00.391Z'\n        }\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/trailers/saveCartItems.js",
    "groupTitle": "Customer_App_-_Trailer_Rental_Old"
  },
  {
    "type": "PUT",
    "url": "/user/password/change",
    "title": "Change Customer Password",
    "name": "CA_-_Change_Customer_Password",
    "group": "Customer_App_-_User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "oldPassword",
            "description": "<p>Old Password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "newPassword",
            "description": "<p>New Password</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint PUT /user/password/change</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\"\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not change password\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/user/changePassword.js",
    "groupTitle": "Customer_App_-_User"
  },
  {
    "type": "DELETE",
    "url": "/user/:email",
    "title": "Delete a Customer",
    "name": "CA_-_Delete_a_Customer",
    "group": "Customer_App_-_User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of the Customer</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint /user/:email that can be used to delete a Customer</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n\n    {\n        success: false,\n        message: \"Could not delete Customer\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 \n\n    {\n        success: true,\n        message: \"Success\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/user/deleteUser.js",
    "groupTitle": "Customer_App_-_User"
  },
  {
    "type": "PUT",
    "url": "/forgotpassword",
    "title": "Forgot Password",
    "name": "CA_-_Forgot_Password",
    "group": "Customer_App_-_User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email Entered By User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "platform",
            "description": "<p>android || ios || web</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint PUT /forgotpassword</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     success: true,\n     message: \"Success\"\n}",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n{\n     success: false,\n     message: \"Error occurred in Forgot Password functionality\",\n     errorsList: []\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/user/forgotPassword.js",
    "groupTitle": "Customer_App_-_User"
  },
  {
    "type": "GET",
    "url": "/user",
    "title": "Get User Details",
    "name": "CA_-_Get_User_Details",
    "group": "Customer_App_-_User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>UserId</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint that can used to get User data</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n\n    {\n        success: false,\n        message: \"Error occurred while fetching User data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "userObj",
            "description": "<p>User Object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 \n\n    {\n        success: true,\n        message: \"Successfully saved User data\",\n        userObj: {\n            \"email\": \"user1@gmail.com\",\n            \"mobile\": \"919876543210\",\n            \"name\":  \"user 1\",\n            \"address\": {\n                \"text\" : \"NorthBridge, NSW, Australia\", \n                \"pincode\" : \"1560\", \n                \"coordinates\" : [ -33.8132, 151.2172 ]\n            },\n            \"dob\": \"2020-01-20\",\n            \"driverLicense\": {\n                \"card\": \"223782weyet\",\n                \"expiry\": \"2022-06-20\",\n                \"state\": \"MH\",\n                \"scan\": \"http://localhost:5000/file/userdrivinglicense/5e395d2f784ae3441c9486bc\",\n                \"verified\": true,\n                \"accepted\": true\n            }\n        }\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/user/getUser.js",
    "groupTitle": "Customer_App_-_User"
  },
  {
    "type": "GET",
    "url": "/profile",
    "title": "Get User Profile",
    "name": "CA_-_Get_User_Profile",
    "group": "Customer_App_-_User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint that can be used to get Profile data</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n\n    {\n        success: false,\n        message: \"Could not fetch Profile data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "userObj",
            "description": "<p>User object</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "rentalsList",
            "description": "<p>List of Rentals/Invoices</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 \n\n    {\n        success: true,\n        message: \"Success\",\n        userObj: {},\n        rentalsList: []\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/user/getProfile.js",
    "groupTitle": "Customer_App_-_User"
  },
  {
    "type": "POST",
    "url": "/signup/otp/resend",
    "title": "Resend OTP",
    "name": "CA_-_Resend_OTP",
    "group": "Customer_App_-_User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mobile",
            "description": "<p>Mobile of the Customer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "country",
            "description": "<p>Country of Customer</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "testMode",
            "description": "<p>Whether this is a test mode</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint POST /signup/otp/resend</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Token is invalid\"\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n    {\n        success: true,\n        message: \"Success\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/user/sendOTPVerification.js",
    "groupTitle": "Customer_App_-_User"
  },
  {
    "type": "PUT",
    "url": "/resetpassword",
    "title": "Reset Password",
    "name": "CA_-_Reset_Password",
    "group": "Customer_App_-_User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Password Reset Token</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password Entered by User</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint PUT /resetpassword</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     success: true,\n     message: \"Password is reset successfully\"\n}",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while resetting a password\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/user/resetPassword.js",
    "groupTitle": "Customer_App_-_User"
  },
  {
    "type": "POST",
    "url": "/customer/email/verify",
    "title": "Send Email Verification Link",
    "name": "CA_-_Send_Email_Verification_Link",
    "group": "Customer_App_-_User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email Id of the Customer</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint POST /customer/email/verify</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Token is invalid.\"\"\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/user/sendEmailVerification.js",
    "groupTitle": "Customer_App_-_User"
  },
  {
    "type": "PUT",
    "url": "/user",
    "title": "Update User",
    "name": "CA_-_Update_User",
    "group": "Customer_App_-_User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "photo",
            "description": "<p>User's Profile Photo ( File )</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "driverLicenseScan",
            "description": "<p>Scanned Image/PDF of User's Driving License ( File )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "reqBody",
            "description": "<p>Request JSON data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User Email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User Password</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "name",
            "description": "<p>Full Name of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mobile",
            "description": "<p>Mobile Number of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dob",
            "description": "<p>Date of Birth of the User ( YYYY-MM-DD )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Address of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "address[country]",
            "description": "<p>Country of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "address[text]",
            "description": "<p>Text Address of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "address[pincode]",
            "description": "<p>Pincode of the User Address</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "address[coordinates]",
            "description": "<p>Coordinates of the User Address [latitude, longitude]</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "driverLicense",
            "description": "<p>Object defining User's Driving License</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "driverLicense[card]",
            "description": "<p>License Number of the User's Driving License</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "driverLicense[expiry]",
            "description": "<p>Expiry Date of the User's Driving License ( MM/YY )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "driverLicense[state]",
            "description": "<p>State of the User's Driving License</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\n    curl --location --request PUT 'http://localhost:5000/user' \\\n    --form 'reqBody={\n        \"mobile\":  \"919876543210\"\n    }' \\\n    --form 'photo=@/home/username/Downloads/user.png' \\\n    --form 'driverLicenseScan=@/home/username/Downloads/driver_license_sample.jpeg'\n\n\nRequest Body ( Example )  ( request.body.reqBody )\n\n    {\n        \"address\": {\n            \"text\" : \"NorthBridge, NSW, Australia\"\n        }\n    }",
          "type": "json"
        }
      ]
    },
    "description": "<p>API Endpoint that can used to update User data</p> <p>Request Headers</p> <ul> <li>'Content-Type: application/json'</li> </ul>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n\n    {\n        success: false,\n        message: \"Could not save User data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "userObj",
            "description": "<p>User Object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 \n    {\n        success: true,\n        message: \"Success\",\n        userObj: {\n            \"_id\": \"\",\n            \"email\": \"user1@gmail.com\",\n            \"mobile\": \"919876543210\",\n            \"name\": \"Mr user 1\",\n            \"address\": {\n                \"text\" : \"NorthBridge, NSW, Australia\", \n                \"pincode\" : \"1560\", \n                \"coordinates\" : [ -33.8132, 151.2172 ]\n            },\n            \"dob\": \"2020-01-20\",\n            \"driverLicense\": {\n                \"card\": \"223782weyet\",\n                \"expiry\": \"2022-06-20\",\n                \"state\": \"MH\",\n                \"scan\": driverLicensePicture\n            }\n        }\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/user/updateUser.js",
    "groupTitle": "Customer_App_-_User"
  },
  {
    "type": "POST",
    "url": "/signin",
    "title": "User SignIn",
    "name": "CA_-_User_SignIn",
    "group": "Customer_App_-_User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email Entered By User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password Entered By User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "fcmDeviceToken",
            "description": "<p>Firebase Cloud Messaging Device Token</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint POST /signin</p> <p>Request Headers</p> <ul> <li>'Content-Type: application/json'</li> </ul> <p>Request Body ( Example )  ( request.body )</p> <p>{ &quot;email&quot;: &quot;user1@gmail.com&quot;, &quot;password&quot;: &quot;1234567890&quot;, &quot;fcmDeviceToken&quot;: &quot;&quot; }</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Please enter valid credentials\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "dataObj",
            "description": "<p>Object containing data</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "userObj",
            "description": "<p>User Object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n {\n     success: true,\n     message: \"Successfully signed in!\",\n     dataObj: {\n         userObj: {\n             \"_id\": \"5e395d2f784ae3441c9486bc\",\n             \"email\": \"user1@gmail.com\",\n             \"mobile\": \"919876543210\",\n             \"name\": \"user 1\",\n             \"address\": {\n                    \"text\" : \"NorthBridge, NSW, Australia\", \n                    \"pincode\" : \"1560\", \n                    \"coordinates\" : [ -33.8132, 151.2172 ] \n                },\n             \"dob\": \"2020-01-20T00:00:00.000Z\",\n             \"driverLicense\": {\n                 \"card\": \"223782weyet\",\n                 \"expiry\": \"2020-06-20\",\n                 \"state\": \"MH\",\n                 \"scan\": \"http://localhost:5000/file/userdrivinglicense/5e395d2f784ae3441c9486bc\",\n                 \"verified\": true,\n                 \"accepted\": true\n             },\n             \"createdAt\": \"2020-02-04T12:01:51.389Z\",\n             \"updatedAt\": \"2020-02-04T12:26:25.353Z\",\n             \"__v\": 5\n         },\n         \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTM5NWQyZjc4NGFlMzQ0MWM5NDg2YmMiLCJpYXQiOjE1ODA4MTkxODUsImV4cCI6MTU4MTQyMzk4NX0.-Yg9zNJQvACGQ65I5xGzQ8b3YgyO1s-UIpWG_4QptKE\"\n     }\n }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/user/signIn.js",
    "groupTitle": "Customer_App_-_User"
  },
  {
    "type": "POST",
    "url": "/signup",
    "title": "User SignUp",
    "name": "CA_-_User_SignUp",
    "group": "Customer_App_-_User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "photo",
            "description": "<p>User's Profile Photo ( File )</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "driverLicenseScan",
            "description": "<p>Scanned Image/PDF of User's Driving License ( File )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "reqBody",
            "description": "<p>Request JSON data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User Email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User Password</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "name",
            "description": "<p>Full Name of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mobile",
            "description": "<p>Mobile Number of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dob",
            "description": "<p>Date of Birth of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "address",
            "description": "<p>Address of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[country]",
            "description": "<p>Country of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[text]",
            "description": "<p>Text Address of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[pincode]",
            "description": "<p>Pincode of the User Address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[coordinates]",
            "description": "<p>Coordinates of the User Address [latitude, longitude]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[city]",
            "description": "<p>City of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[state]",
            "description": "<p>State of the User</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "driverLicense",
            "description": "<p>Object defining User's Driving License</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "driverLicense[card]",
            "description": "<p>License Number of the User's Driving License</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "driverLicense[expiry]",
            "description": "<p>Expiry Date of the User's Driving License ( 02/23 )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "driverLicense[state]",
            "description": "<p>State of the User's Driving License</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\n    curl --location --request POST 'http://localhost:5000/signup' \\\n    --form 'reqBody={\n        \"email\": \"nehakadam@usernameinfotech.com\",\n        \"mobile\": \"9664815262\",\n        \"name\": \"User 6\",\n        \"address\": {\n            \"country\": \"India\",\n            \"text\": \"Lower Parel, Mumbai, India\",\n            \"pincode\": \"400013\",\n            \"coordinates\": [72.877656, 19.075984]\n        },\n        \"dob\": \"1995-01-20\",\n        \"password\": \"abCd@1234\",\n        \"driverLicense\": {\n            \"card\": \"223782weyet\",\n            \"expiry\": \"06/23\",\n            \"state\": \"NSW\"\n        }\n    }' \\\n    --form 'photo=@/home/username/Downloads/user.png' \\\n    --form 'driverLicenseScan=@/home/username/Downloads/driver_license_sample.jpeg'\n\n\nRequest Headers\n- 'Content-Type: application/json'\n\nRequest Body ( Example )  ( request.body.reqBody )\n\n    {\n        \"email\": \"johndoe@gmail.com\",\n        \"mobile\": \"919876543210\",\n        \"name\": \"John Doe\",\n        \"dob\": \"2020-01-20\",\n        \"password\": \"aBcd@1234\",\n        \"address\": {\n            \"country\": \"Australia\",\n            \"text\" : \"NorthBridge, NSW, Australia\", \n            \"pincode\" : \"1560\", \n            \"coordinates\" : [ -33.8132, 151.2172 ] \n        },\n        \"driverLicense\": {\n            \"card\": \"223782weyet\",\n            \"expiry\": \"2020-06-20\",\n            \"state\": \"MH\",\n        }\n    }",
          "type": "json"
        }
      ]
    },
    "description": "<p>API Endpoint POST /signup</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Email is empty\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/user/signUp.js",
    "groupTitle": "Customer_App_-_User"
  },
  {
    "type": "GET",
    "url": "/customer/email/verify",
    "title": "Verify Email Id of the Customer",
    "name": "CA_-_Verify_Email_Id_of_the_Customer",
    "group": "Customer_App_-_User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token sent in the Email Link</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /customer/email/verify</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Token is invalid\"\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "File",
            "optional": false,
            "field": "file",
            "description": "<p>HTML File</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK with appropriate html file",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/user/verifyEmail.js",
    "groupTitle": "Customer_App_-_User"
  },
  {
    "type": "POST",
    "url": "/signup/verify",
    "title": "Verify Mobile Number of the Customer",
    "name": "CA_-_Verify_Mobile_Number_of_the_Customer",
    "group": "Customer_App_-_User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mobile",
            "description": "<p>Mobile Number of the Customer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "country",
            "description": "<p>Country of Customer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "otp",
            "description": "<p>OTP sent on the Customer Mobile</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "testMode",
            "description": "<p>Whether this is a test mode</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint POST /signup/verify</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Token is invalid\"\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/customer/user/signUpVerify.js",
    "groupTitle": "Customer_App_-_User"
  },
  {
    "type": "DELETE",
    "url": "/employee",
    "title": "Delete an Employee",
    "name": "LA_-_Delete_an_Employee",
    "group": "Licensee_App_-_Employee",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of the Employee</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n\n    {\n        success: false,\n        message: \"Could not delete Employee\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 \n\n    {\n        success: true,\n        message: \"Success\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/deleteEmployee.js",
    "groupTitle": "Licensee_App_-_Employee"
  },
  {
    "type": "PUT",
    "url": "/employee/profile",
    "title": "Employee Update Profile",
    "name": "LA_-_Employee_Update_Profile",
    "group": "Licensee_App_-_Employee",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "employeePhoto",
            "description": "<p>User's Profile Photo ( File )</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "employeeDriverLicenseScan",
            "description": "<p>Scanned Image/PDF of User's Driving License ( File ) [ Driver license ( Front &amp; Back ) ]</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "employeeAdditionalDocumentScan",
            "description": "<p>Scanned Image/PDF of User's Additional Document ( File ) [ Passport, ID card ( Front &amp; Back ), Photo card (New South Wales) ]</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "reqBody",
            "description": "<p>Request JSON data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mobile",
            "description": "<p>Mobile Number of Employee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "country",
            "description": "<p>Employee's Country</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Employee's Name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Exmployee's Email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dob",
            "description": "<p>Date of Birth ( &quot;YYYY-MM-DD&quot; format )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Type of Employee ( &quot;employee&quot;, &quot;representative&quot;, &quot;director&quot;, &quot;executive&quot; )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Employee's Title in Company</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "acl",
            "description": "<p>Exployee Access Privileges List ( Only Owner can change this )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employeeId",
            "description": "<p>Employee Id ( Only Admins have to pass it while updating data of other Employees )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "driverLicense",
            "description": "<p>Driver License Details</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "driverLicense[card]",
            "description": "<p>License Number of Driver License</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "driverLicense[expiry]",
            "description": "<p>Expiry Date of Driver License</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "driverLicense[state]",
            "description": "<p>State in which Driver License is issued</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "address",
            "description": "<p>Address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[text]",
            "description": "<p>Address Text</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[pincode]",
            "description": "<p>Address Pincode</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[coordinates]",
            "description": "<p>Address Location [latitude, longitude]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[city]",
            "description": "<p>Address City</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[state]",
            "description": "<p>Address State</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[country]",
            "description": "<p>Address Country</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\ncurl --location --request PUT 'http://localhost:5000/employee/profile/' \\\n--form 'reqBody={\n    \"employeeId\": \"123\",\n    \"name\": \"Owner 1\"\n}'",
          "type": "json"
        }
      ]
    },
    "description": "<p>API Endpoint PUT /employee/profile</p> <p>Request Headers</p> <ul> <li>'Content-Type: application/json'</li> </ul>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while updating Employee account data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "employeeObj",
            "description": "<p>Employee object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully updated Employee account data\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/updateEmployee.js",
    "groupTitle": "Licensee_App_-_Employee"
  },
  {
    "type": "GET",
    "url": "/licensee/employee/acl",
    "title": "Get Access Control List",
    "name": "LA_-_Get_Access_Control_List",
    "group": "Licensee_App_-_Employee",
    "description": "<p>API Endpoint GET /licensee/employee/acl</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "accessControlList",
            "description": "<p>Object with Access Control details of logged in employee</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 \n    {\n        success: true,\n        message: \"Success\",\n        accessControlList: {\n            \"TRAILER\": [\"ADD\", \"VIEW\", \"UPDATE\"],\n            \"UPSELL\": [\"ADD\", \"VIEW\", \"UPDATE\"],\n            \"INSURANCE\": [\"ADD\", \"VIEW\", \"UPDATE\"],\n            \"SERVICING\": [\"ADD\", \"VIEW\", \"UPDATE\"],\n            \"REMINDERS\": [\"VIEW\"],\n            \"FINANCIALS\": [\"VIEW\"],\n            \"DOCUMENTS\": [\"VIEW\"]\n        }\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not fetch Access Control List\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/getAccessControlList.js",
    "groupTitle": "Licensee_App_-_Employee"
  },
  {
    "type": "GET",
    "url": "/employee/profile",
    "title": "Get Employee Profile",
    "name": "LA_-_Get_Employee_Profile",
    "group": "Licensee_App_-_Employee",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employeeId",
            "description": "<p>Employee ID</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /employee/profile</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Employee data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "employeeObj",
            "description": "<p>Employee details object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\",\n        employeeObj: {}\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/getEmployee.js",
    "groupTitle": "Licensee_App_-_Employee"
  },
  {
    "type": "GET",
    "url": "/employee/profile/licensee",
    "title": "Get Licensee Details for where Employee works",
    "name": "LA_-_Get_Licensee_Details_for_where_Employee_works",
    "group": "Licensee_App_-_Employee",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /employee/profile/licensee</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not fetch Licensee data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "licenseeObj",
            "description": "<p>Licensee details</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\",\n        licenseeObj: {}\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/getLicensee.js",
    "groupTitle": "Licensee_App_-_Employee"
  },
  {
    "type": "GET",
    "url": "/employees",
    "title": "Get all employees",
    "name": "LA_-_Get_all_employees",
    "group": "Licensee_App_-_Employee",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization Token</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /employees</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Employees List\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "employeeList",
            "description": "<p>List of Employees</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully fetched Employees List\",\n        employeeList: []\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/getEmployees.js",
    "groupTitle": "Licensee_App_-_Employee"
  },
  {
    "type": "PUT",
    "url": "/employee/password/change",
    "title": "Change Employee Password",
    "name": "LA_-_Change_Employee_Password",
    "group": "Licensee_App_-_Employee_Authentication",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "oldPassword",
            "description": "<p>Old Password of Employee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "newPassword",
            "description": "<p>New Password of Employee</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint PUT /employee/password/change</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\"\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not change password\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/changePassword.js",
    "groupTitle": "Licensee_App_-_Employee_Authentication"
  },
  {
    "type": "POST",
    "url": "/employee/invite",
    "title": "Employee Invite",
    "name": "LA_-_Employee_Invite",
    "group": "Licensee_App_-_Employee_Authentication",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email Entered By Employee</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "acl",
            "description": "<p>ACL List</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Type of Employee ( &quot;employee&quot;, &quot;representative&quot;, &quot;director&quot;, &quot;executive&quot; )</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint POST /employee/signin</p> <p>Request Headers</p> <ul> <li>'Content-Type: application/json'</li> </ul> <p>Request Body ( Example )  ( request.body )</p> <p>{ &quot;email&quot;: &quot;user1@gmail.com&quot;, &quot;acl&quot;: { &quot;TRAILER&quot; : [ &quot;VIEW&quot; ], &quot;UPSELL&quot; : [ &quot;VIEW&quot; ] } }</p> <pre><code>curl --location --request POST 'http://trailer2you.herokuapp.com/employee/invite' \\ --header 'Content-Type: application/json' \\ --data-raw '{     &quot;email&quot;: &quot;nehakadam@nimapinfotech.com&quot;,     &quot;acl&quot;: { &quot;TRAILER&quot; : [ &quot;VIEW&quot; ], &quot;UPSELL&quot; : [ &quot;VIEW&quot; ] },     &quot;type&quot;: &quot;employee&quot; }'</code></pre>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while sending an Invitation to Employee\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully sent an Invitation to Employe\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/inviteEmployee.js",
    "groupTitle": "Licensee_App_-_Employee_Authentication"
  },
  {
    "type": "POST",
    "url": "/employee/invite/accept",
    "title": "Employee Invite Accept",
    "name": "LA_-_Employee_Invite_Accept",
    "group": "Licensee_App_-_Employee_Authentication",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "employeePhoto",
            "description": "<p>User's Profile Photo ( File ) ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "employeeDriverLicenseScan",
            "description": "<p>Scanned Image/PDF of User's Driving License ( File ) [ Driver license ( Front &amp; Back ) ] ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "employeeAdditionalDocumentScan",
            "description": "<p>Scanned Image/PDF of User's Additional Document ( File ) [ Passport, ID card ( Front &amp; Back ), Photo card (New South Wales) ]</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "reqBody",
            "description": "<p>Request JSON data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Invite Token sent to the Employee  ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of Employee  ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Employee's Title in Company ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mobile",
            "description": "<p>Mobile Number of Employee ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "country",
            "description": "<p>Country of the employee ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Employee's Name ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dob",
            "description": "<p>Date of Birth ( &quot;YYYY-MM-DD&quot; format ) ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "driverLicense",
            "description": "<p>Driver License Details ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "driverLicense[card]",
            "description": "<p>License Number of Driver License</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "driverLicense[expiry]",
            "description": "<p>Expiry Date of Driver License</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "driverLicense[state]",
            "description": "<p>State in which Driver License is issued</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "address",
            "description": "<p>Address ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[text]",
            "description": "<p>Address Text</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[pincode]",
            "description": "<p>Address Pincode</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[coordinates]",
            "description": "<p>Address Location [latitude, longitude]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[city]",
            "description": "<p>Address City</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[state]",
            "description": "<p>Address State</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address[country]",
            "description": "<p>Address Country</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\ncurl --location --request POST 'http://localhost:5000/employee/invite/accept' \\\n--form 'reqBody={\n    \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTYyNDg4ZTkwZTUzZjQ2YzE0OGFiOGYiLCJpYXQiOjE1ODM0OTk0MDYsImV4cCI6MTU4MzUwMDMwNn0.nFjBSPvWjYDK_53gFYqPqq61Z2YTc1Kga4oJBtgl05s\",\n    \n    \"password\": \"aBc$56887\",\n    \n    \"mobile\": \"919876543210\",\n    \"country\": \"India\",\n    \n    \"name\": \"Employee 1\",\n    \"title\": \"Supervisor\",\n    \"dob\": \"1980-11-14\",\n    \n    \"driverLicense\": {\n        \"card\": \"223782weyet\",\n        \"expiry\": \"06/23\",\n        \"state\": \"NSW\"\n    },\n    \"address\": {\n        \"text\": \"NorthBridge, NSW, Australia\",\n        \"pincode\": \"1560\",\n        \"coordinates\": [-33.8132, 151.2172],\n        \"city\": \"Sydney\",\n        \"state\": \"New South Wales\",\n        \"country\": \"Australia\"\n    }\n}' \\\n--form 'employeePhoto=@/home/username/Downloads/user.png' \\\n--form 'employeeDriverLicenseScan=@/home/username/Downloads/driver_license_sample.jpeg'",
          "type": "json"
        }
      ]
    },
    "description": "<p>API Endpoint POST /employee/invite/accept</p> <p>Request Headers</p> <ul> <li>'Content-Type: application/json'</li> </ul>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while saving Employee account data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "employeeObj",
            "description": "<p>Employee details object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully saved Employee account data\",\n        employeeObj: {}\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/saveEmployee.js",
    "groupTitle": "Licensee_App_-_Employee_Authentication"
  },
  {
    "type": "PUT",
    "url": "/employee/forgotpassword",
    "title": "Forgot Password",
    "name": "LA_-_Forgot_Password",
    "group": "Licensee_App_-_Employee_Authentication",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email Entered By Employee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "platform",
            "description": "<p>android || ios || web</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint PUT /employee/forgotpassword</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    success: true,\n    message: \"Forgot Password Email Sent Successfully\"\n}",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred in Forgot Password functionality\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/forgotPassword.js",
    "groupTitle": "Licensee_App_-_Employee_Authentication"
  },
  {
    "type": "PUT",
    "url": "/employee/resetpassword",
    "title": "Reset Password",
    "name": "LA_-_Reset_Password",
    "group": "Licensee_App_-_Employee_Authentication",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Password Reset Token</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password Entered by User</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint PUT /employee/resetpassword</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     success: true,\n     message: \"Password is reset successfully\"\n}",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while resetting a password\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/resetPassword.js",
    "groupTitle": "Licensee_App_-_Employee_Authentication"
  },
  {
    "type": "POST",
    "url": "/stripe/account",
    "title": "Create Stripe Account for the Licensee",
    "name": "LA_-_Create_Stripe_Account_for_the_Licensee",
    "group": "Licensee_App_-_Licensee",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mcc",
            "description": "<p>MCC of a Company</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>URL of a Company Website</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "productDescription",
            "description": "<p>Product Description of a Company</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "accountNumber",
            "description": "<p>Account Number of a Company</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "taxId",
            "description": "<p>Tax Id of a Company ( For Business Type = &quot;company&quot; )</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /stripe/details</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not fetch Stripe Details for the Licensee\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "detailsObj",
            "description": "<p>Licensee details</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\",\n        detailsObj: {}\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/createStripeAccount.js",
    "groupTitle": "Licensee_App_-_Licensee"
  },
  {
    "type": "GET",
    "url": "/stripe/details",
    "title": "Get Stripe Details for the Licensee",
    "name": "LA_-_Get_Stripe_Details_for_the_Licensee",
    "group": "Licensee_App_-_Licensee",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /stripe/details</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not fetch Stripe Details for the Licensee\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "detailsObj",
            "description": "<p>Licensee details</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\",\n        detailsObj: {}\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/getStripeDetails.js",
    "groupTitle": "Licensee_App_-_Licensee"
  },
  {
    "type": "PUT",
    "url": "/licensee",
    "title": "Update Licensee Details",
    "name": "LA_-_Update_Licensee_Details",
    "group": "Licensee_App_-_Licensee",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "licenseeLogo",
            "description": "<p>Licensee Business Logo ( File )</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "licenseeProofOfIncorporation",
            "description": "<p>Licensee Proof of Incorporation of a Business ( File )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "reqBody",
            "description": "<p>Request JSON data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[name]",
            "description": "<p>Licensee Name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[email]",
            "description": "<p>Licensee Email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[country]",
            "description": "<p>Licensee Country</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[mobile]",
            "description": "<p>Licensee Mobile</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[businessType]",
            "description": "<p>Business Type [&quot;individual&quot;, &quot;company&quot;]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[bsbNumber]",
            "description": "<p>BSB Number of thhe Licensee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[accountNumber]",
            "description": "<p>Bank Account Number of Licensee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[mcc]",
            "description": "<p>Merchant Category Code</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[url]",
            "description": "<p>URL of Business Website</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[productDescription]",
            "description": "<p>Business/Core Product Description</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[taxId]",
            "description": "<p>Company Tax ID - Australian Company Number (ACN)</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "licensee[workingDays]",
            "description": "<p>Working Days - [&quot;monday&quot;,&quot;tuesday&quot;,&quot;wednesday&quot;,&quot;thursday&quot;,&quot;friday&quot;, &quot;saturday&quot;, &quot;sunday&quot;]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[workingHours]",
            "description": "<p>Working Hours - &quot;1000-1900&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "licensee[address]",
            "description": "<p>Licensee Address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.text]",
            "description": "<p>Licensee Address Text</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.pincode]",
            "description": "<p>Licensee Address Pincode</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.coordinates]",
            "description": "<p>Licensee Address Location Coordinates [latitude, longitude]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.city]",
            "description": "<p>Licensee City</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.state]",
            "description": "<p>Licensee State</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.country]",
            "description": "<p>Licensee Country</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "licensee[licenseeLocations]",
            "description": "<p>Array of Licensee Locations</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.text]",
            "description": "<p>Licensee Address Text</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.pincode]",
            "description": "<p>Licensee Address Pincode</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.coordinates]",
            "description": "<p>Licensee Address Location Coordinates [latitude, longitude]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.city]",
            "description": "<p>Licensee City</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.state]",
            "description": "<p>Licensee State</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.country]",
            "description": "<p>Licensee Country</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\ncurl --location --request PUT 'http://localhost:5000/licensee/' \\\n--form 'reqBody={\n    \"accountNumber\": \"32463468434\",\n    \"bsbNumber\": \"AGDG34734343\",\n    \"radius\": 200\n}'",
          "type": "json"
        }
      ]
    },
    "description": "<p>API Endpoint PUT /licensee</p> <p>Request Headers</p> <ul> <li>'Content-Type: application/json'</li> </ul>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while updating Licensee data\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "licenseeObj",
            "description": "<p>Licensee object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n   {\n        success: true,\n        message: \"Successfully updated Licensee data\",\n        licenseeObj: {\n            isEmailVerified: false,\n            businessType: 'individual',\n            availability: true,\n            _id: '5e61dccae0c80415dd15d6d4',\n            name: 'Licensee 1',\n            email: 'licensee1@gmail.com',\n            mobile: '919876543210',\n            address: {\n                text: 'NorthBridge, NSW, Australia',\n                pincode: '1560',\n                coordinates: [43.8477,-111.6932]\n            },\n            licenseeLocations: [ \n                {\n                    text: 'NorthBridge, NSW, Australia',\n                    pincode: '1560',\n                    coordinates: [43.8477,-111.6932]\n                }\n            ],\n            proofOfIncorporation: 'http://localhost:5000/file/licenseeproof/5e61dccae0c80415dd15d6d4',\n            logo: 'http://localhost:5000/file/licenseelogo/5e61dccae0c80415dd15d6d4',\n            createdAt: '2020-03-06T05:16:58.146Z',\n            updatedAt: '2020-03-06T05:16:58.148Z',\n            __v: 0\n        }\n   }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/updateLicensee.js",
    "groupTitle": "Licensee_App_-_Licensee"
  },
  {
    "type": "PUT",
    "url": "/licensee/status",
    "title": "Update Licensee Status",
    "name": "LA_-_Update_Licensee_Status",
    "group": "Licensee_App_-_Licensee",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>{ licenseeId: <String>, // required, id of the licensee status: <String> // &quot;avaialble&quot; or &quot;away&quot; }</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to update Licensee Status</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while saving Licensee Status\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully saved Licensee Status\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/setLicenseeStatus.js",
    "groupTitle": "Licensee_App_-_Licensee"
  },
  {
    "type": "POST",
    "url": "/employee/signin",
    "title": "Employee SignIn",
    "name": "LA_-_Employee_SignIn",
    "group": "Licensee_App_-_Licensee_Authentication",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email Entered By Employee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password Entered By Employee</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint POST /employee/signin</p> <p>Request Headers</p> <ul> <li>'Content-Type: application/json'</li> </ul> <p>Request Body ( Example )  ( request.body )</p> <p>{ &quot;email&quot;: &quot;user1@gmail.com&quot;, &quot;password&quot;: &quot;1234567890&quot; }</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Please enter valid credentials\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "employeeObj",
            "description": "<p>Sign-in Employee object</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "licenseeObj",
            "description": "<p>Licensee details object where employee works</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Employee Token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully signed in!\",\n        dataObj: {\n            employeeObj: {\n            },\n            licenseeObj: {\n            }\n            \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTM5NWQyZjc4NGFlMzQ0MWM5NDg2YmMiLCJpYXQiOjE1ODA4MTkxODUsImV4cCI6MTU4MTQyMzk4NX0.-Yg9zNJQvACGQ65I5xGzQ8b3YgyO1s-UIpWG_4QptKE\"\n        }\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/signIn.js",
    "groupTitle": "Licensee_App_-_Licensee_Authentication"
  },
  {
    "type": "GET",
    "url": "/licensee/state",
    "title": "GET CSRF Token for Licensee",
    "name": "LA_-_GET_CSRF_Token_for_Licensee",
    "group": "Licensee_App_-_Licensee_Authentication",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Licensee Auth Token</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint POST /licensee/state</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while generating State\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully fetched generated State\",\n        state: \"\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/getStateValue.js",
    "groupTitle": "Licensee_App_-_Licensee_Authentication"
  },
  {
    "type": "POST",
    "url": "/licensee",
    "title": "Licensee Signup",
    "name": "LA_-_Licensee_Signup",
    "group": "Licensee_App_-_Licensee_Authentication",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "licenseeLogo",
            "description": "<p>Licensee Business Logo ( File ) ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "licenseeProofOfIncorporation",
            "description": "<p>Licensee Proof of Incorporation of a Business ( File ) ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "employeePhoto",
            "description": "<p>User's Profile Photo ( File ) ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "employeeDriverLicenseScan",
            "description": "<p>Scanned Image/PDF of User's Driving License ( File ) [ Driver license ( Front &amp; Back ) ] ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "employeeAdditionalDocumentScan",
            "description": "<p>Scanned Image/PDF of User's Additional Document ( File ) [ Passport, ID card ( Front &amp; Back ), Photo card (New South Wales) ] ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "reqBody",
            "description": "<p>Request JSON data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[name]",
            "description": "<p>Licensee Name ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[email]",
            "description": "<p>Licensee Email ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[mobile]",
            "description": "<p>Licensee Mobile ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[country]",
            "description": "<p>Licensee Country ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[businessType]",
            "description": "<p>Business Type [&quot;individual&quot;, &quot;company&quot;] ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "licensee[address]",
            "description": "<p>Licensee Address ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.text]",
            "description": "<p>Licensee Address Text</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.pincode]",
            "description": "<p>Licensee Address Pincode</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.coordinates]",
            "description": "<p>Licensee Address Location [latitude, longitude]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.city]",
            "description": "<p>Licensee City</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.state]",
            "description": "<p>Licensee State</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[address.country]",
            "description": "<p>Licensee Country</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "licensee[workingDays]",
            "description": "<p>Working Days</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[workingHours]",
            "description": "<p>Working Hours</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "licensee[licenseeLocations]",
            "description": "<p>Array of Licensee Locations</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.text]",
            "description": "<p>Licensee Address Text</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.pincode]",
            "description": "<p>Licensee Address Pincode</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.coordinates]",
            "description": "<p>Licensee Address Location [latitude, longitude]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.city]",
            "description": "<p>Licensee City</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.state]",
            "description": "<p>Licensee State</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[licenseeLocations.0.country]",
            "description": "<p>Licensee Country</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[bsbNumber]",
            "description": "<p>BSB Number of the Licensee ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[accountNumber]",
            "description": "<p>Bank Account Number of Licensee ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[mcc]",
            "description": "<p>Merchant Category Code ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[url]",
            "description": "<p>URL of Business Website</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[productDescription]",
            "description": "<p>Business/Core Product Description ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "licensee[taxId]",
            "description": "<p>Company Tax ID - Australian Company Number (ACN) ( required, 9 numberic digits )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[name]",
            "description": "<p>Owner Name ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[email]",
            "description": "<p>Owner Email ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[mobile]",
            "description": "<p>Owner Mobile ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[country]",
            "description": "<p>Owner Country ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[password]",
            "description": "<p>Owner's Password  ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[title]",
            "description": "<p>Owner Title in Company ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[dob]",
            "description": "<p>Owner Date of Birth ( &quot;YYYY-MM-DD&quot; format ) ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "employee[address]",
            "description": "<p>Owner Address ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[address.text]",
            "description": "<p>Owner Address Text</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[address.pincode]",
            "description": "<p>Owner Address Pincode</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[address.coordinates]",
            "description": "<p>Owner Address Location [latitude, longitude]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[address.city]",
            "description": "<p>Owner Address City</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[address.state]",
            "description": "<p>Owner Address State</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[address.country]",
            "description": "<p>Owner Address Country</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "employee[driverLicense]",
            "description": "<p>Driver License Details ( required )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[driverLicense.card]",
            "description": "<p>License Number of Driver License</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[driverLicense.expiry]",
            "description": "<p>Expiry Date of Driver License</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "employee[driverLicense.state]",
            "description": "<p>State in which Driver License is issued</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example: ",
          "content": "\n\ncurl --location --request POST 'http://localhost:5000/licensee' \\\n--form 'reqBody={\n    \"employee\": {\n        \"name\": \"Neha Kadam\",\n        \"mobile\": \"9664815262\",\n        \"country\": \"india\",\n        \"email\": \"neha1@licenseetrailers.com\",\n        \"password\": \"aBcd@1234\",\n        \"title\": \"Owner\",\n        \"dob\": \"1970-05-15\",\n        \"driverLicense\": {\n            \"card\": \"223782weyet\",\n            \"expiry\": \"06/23\",\n            \"state\": \"NSW\"\n        },\n        \"address\": {\n            \"text\": \"NorthBridge, NSW, Australia\",\n            \"pincode\": \"1560\",\n            \"coordinates\": [-33.8132, 151.2172],\n            \"city\": \"Sydney\",\n            \"state\": \"NSW\",\n            \"country\": \"Australia\"\n        }\n    },\n    \"licensee\": {\n        \"name\": \"Neha'\\''s Trailers\",\n        \"mobile\": \"9664815262\",\n        \"country\": \"india\",\n        \"email\": \"neha1@licenseetrailers.com\",\n        \"address\": {\n            \"text\": \"NorthBridge, NSW, Australia\",\n            \"pincode\": \"1560\",\n            \"coordinates\": [-33.8132, 151.2172],\n            \"city\": \"Sydney\",\n            \"state\": \"NSW\",\n            \"country\": \"Australia\"\n        },\n        \"workingDays\": [\"Monday\",\"Tuesday\",\"Wednesday\"],\n        \"workingHours\": \"0700-1900\",\n        \n        \"businessType\": \"individual\",\n        \"bsbNumber\": \"ABCDEF\",\n        \"accountNumber\": \"AB1234\",\n        \"mcc\": \"7513\",\n        \"url\": \"http://neha1.licenseetrailers.com\",\n        \"productDescription\": \"Trailer Rental\", \n        \"taxId\": \"123456789\"\n    }\n}' \\\n--form 'licenseeLogo=@/home/username/Downloads/company_logo.jpeg' \\\n--form 'licenseeProofOfIncorporation=@/home/username/Downloads/proofOfIncorporation.png' \\\n--form 'employeePhoto=@/home/username/Downloads/user.png' \\\n--form 'employeeDriverLicenseScan=@/home/username/Downloads/driver_license_sample.jpeg'",
          "type": "json"
        }
      ]
    },
    "description": "<p>API Endpoint POST /licensee</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while creating Licensee Account\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "licenseeObj",
            "description": "<p>Licensee details object</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "employeeObj",
            "description": "<p>Onwer details object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n   {\n        success: true,\n        message: \"Success\",\n        licenseeObj: {\n            isEmailVerified: false,\n            businessType: 'individual',\n            availability: true,\n            _id: '5e61dccae0c80415dd15d6d4',\n            name: 'Licensee 1',\n            email: 'licensee1@gmail.com',\n            mobile: '919876543210',\n            address: {\n                text: 'NorthBridge, NSW, Australia',\n                pincode: '1560',\n                location: [Object]\n            },\n            licenseeLocations: [ [Object] ],\n            proofOfIncorporation: 'http://localhost:5000/file/licenseeproof/5e61dccae0c80415dd15d6d4',\n            logo: 'http://localhost:5000/file/licenseelogo/5e61dccae0c80415dd15d6d4',\n            createdAt: '2020-03-06T05:16:58.146Z',\n            updatedAt: '2020-03-06T05:16:58.148Z',\n            __v: 0\n        },\n        employeeObj: {\n            isOwner: true,\n            acl: {\n                'TRAILER': ['VIEW', 'ADD', 'UPDATE'],\n                'UPSELL': ['VIEW', 'ADD', 'UPDATE']\n            },\n            isEmailVerified: false,\n            _id: '5e61dccae0c80415dd15d6d6',\n            name: 'Owner 1',\n            mobile: '919876543210',\n            email: 'owner@trailerslicensee.com',\n            licenseeId: '5e61dccae0c80415dd15d6d4',\n            createdAt: '2020-03-06T05:16:58.152Z',\n            updatedAt: '2020-03-06T05:16:58.153Z',\n            __v: 0\n        }\n   }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/saveLicensee.js",
    "groupTitle": "Licensee_App_-_Licensee_Authentication"
  },
  {
    "type": "POST",
    "url": "/licensee/otp/resend",
    "title": "Resend OTP",
    "name": "LA_-_Resend_OTP",
    "group": "Licensee_App_-_Licensee_Authentication",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mobile",
            "description": "<p>Mobile of the Licensee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "country",
            "description": "<p>Country of Licensee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>Type of User - &quot;licensee&quot; or &quot;employee&quot; ( default : &quot;employee&quot; )</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "testMode",
            "description": "<p>Whether this is a test mode</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint POST /licensee/otp/resend</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Token is invalid.\"\"\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/sendOTPVerification.js",
    "groupTitle": "Licensee_App_-_Licensee_Authentication"
  },
  {
    "type": "GET",
    "url": "/licensee/stripe",
    "title": "Save Stripe Account Details for Licensee",
    "name": "LA_-_Save_Stripe_Account_Details_for_Licensee",
    "group": "Licensee_App_-_Licensee_Authentication",
    "description": "<p>API Endpoint POST /licensee/stripe</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not save Stripe Details\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully fetched generated State\",\n        state: \"\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/saveLicenseeStripe.js",
    "groupTitle": "Licensee_App_-_Licensee_Authentication"
  },
  {
    "type": "POST",
    "url": "/licensee/email/verify/resend",
    "title": "Send Email Verification Link",
    "name": "LA_-_Send_Email_Verification_Link",
    "group": "Licensee_App_-_Licensee_Authentication",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email Id of the Licensee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>Type of User ( &quot;licensee&quot; or &quot;employee&quot; ) ( default : &quot;employee&quot; )</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint POST /licensee/email/verify/resend</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not send Email Verification\"\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/sendEmailVerification.js",
    "groupTitle": "Licensee_App_-_Licensee_Authentication"
  },
  {
    "type": "GET",
    "url": "/licensee/email/verify",
    "title": "Verify Email Id of the Licensee",
    "name": "LA_-_Verify_Email_Id_of_the_Licensee",
    "group": "Licensee_App_-_Licensee_Authentication",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token sent in the Email Link</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /licensee/email/verify</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Token is invalid.\"\"\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "File",
            "optional": false,
            "field": "file",
            "description": "<p>HTML File with Email Verification Status Message</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/verifyEmail.js",
    "groupTitle": "Licensee_App_-_Licensee_Authentication"
  },
  {
    "type": "GET",
    "url": "/employee/email/verify",
    "title": "Verify Email Id of the Licensee",
    "name": "LA_-_Verify_Email_Id_of_the_Licensee",
    "group": "Licensee_App_-_Licensee_Authentication",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token sent in the Email Link</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /employee/email/verify</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Token is invalid.\"\"\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "File",
            "optional": false,
            "field": "file",
            "description": "<p>HTML File with Email Verification Status Message</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/verifyEmailEmployee.js",
    "groupTitle": "Licensee_App_-_Licensee_Authentication"
  },
  {
    "type": "POST",
    "url": "/licensee/otp/verify",
    "title": "Verify Mobile Number of the Licensee",
    "name": "LA_-_Verify_Mobile_Number_of_the_Licensee",
    "group": "Licensee_App_-_Licensee_Authentication",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mobile",
            "description": "<p>Mobile Number of the Licensee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "country",
            "description": "<p>Country of Licensee</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>Type of User - &quot;licensee&quot; or &quot;employee&quot; ( default : &quot;employee&quot; )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "otp",
            "description": "<p>OTP sent on the Licensee Mobile</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "testMode",
            "description": "<p>Whether this is a test mode</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint POST /licensee/otp/verify</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Token is invalid.\"\"\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n    {\n        success: true,\n        message: \"Success\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/user/verifyOTP.js",
    "groupTitle": "Licensee_App_-_Licensee_Authentication"
  },
  {
    "type": "POST",
    "url": "/trailer/block",
    "title": "Block the Trailer",
    "name": "LA_-_Block_the_Trailer",
    "group": "Licensee_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Id of the Trailer Blocking Time record ( for update requests only )</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "items",
            "description": "<p>Array of Items</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "items[itemType]",
            "description": "<p>Type of Item - Trailer or Upsell Item</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "items[itemId]",
            "description": "<p>Id of the Trailer or Upsell Item</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "items[units]",
            "description": "<p>Number of Units of Upsell Items to be blocked</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "startDate",
            "description": "<p>Start Date of Blocking Period ( &quot;YYYY-MM-DD HH:mm&quot; )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "endDate",
            "description": "<p>End Date of Blocking Period ( &quot;YYYY-MM-DD HH:mm&quot; )</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "isDeleted",
            "description": "<p>Whether to delete Trailer Blocking Record ( false || true )</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Trailer Blocking details</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Could not save Trailer Blocking details\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "trailerBlockedObj",
            "description": "<p>Blocked Trailer details object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n\n{\n     success: true,\n     message: \"Success\",\n     trailerBlockedObj: {}\n}",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/saveTrailerBlocking.js",
    "groupTitle": "Licensee_App_-_Trailer"
  },
  {
    "type": "DELETE",
    "url": "/trailer",
    "title": "Delete a Trailer",
    "name": "LA_-_Delete_a_Trailer",
    "group": "Licensee_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of the Trailer</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n\n    {\n        success: false,\n        message: \"Could not delete Trailer\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 \n\n    {\n        success: true,\n        message: \"Success\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/deleteTrailer.js",
    "groupTitle": "Licensee_App_-_Trailer"
  },
  {
    "type": "DELETE",
    "url": "/upsellitem",
    "title": "Delete an Upsell Item",
    "name": "LA_-_Delete_an_Upsell_Item",
    "group": "Licensee_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of the Upsell Item</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n\n    {\n        success: false,\n        message: \"Could not delete Upsell Item\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 \n\n    {\n        success: true,\n        message: \"Success\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/deleteUpsellItem.js",
    "groupTitle": "Licensee_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/licensee/docs",
    "title": "Get Documents List",
    "name": "LA_-_Get_Documents_List",
    "group": "Licensee_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Type of a Document ( &quot;insurance&quot;, &quot;servicing&quot;, &quot;proofOfIncorporation&quot;, &quot;license&quot; )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Trailers to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Trailers to skip</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /licensee/docs</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "documentList",
            "description": "<p>List of Documents</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Successfully fetched Documents List\",\n        documentsList: []\n    }\n\n\nSample API Call : http://localhost:5000/licensee/docs?type=insurance&count=10&skip=0",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Documents List\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/getDocumentsList.js",
    "groupTitle": "Licensee_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/reminders",
    "title": "Get Reminders List",
    "name": "LA_-_Get_Reminders_List",
    "group": "Licensee_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Reminders to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Reminders to skip</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /reminders</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "remindersList",
            "description": "<p>List of Reminders</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Successfully fetched Reminders data\",\n        remindersList: [\n            {\n                \"itemId\": \"5e4132b4603c2159b3e58ac0\",\n                \"itemName\": \"2020 C&B DMP610-6TA 26\\\"\",\n                \"itemPhoto\": \"http://localhost:5000/file/trailer/5e4132b4603c2159b3e58ac0/1\",\n                \"reminderType\": \"Insurance Deadline\",\n                \"expiringItemId\": \"5e6a21e450792f3929f89c03\",\n                \"expiryDate\": \"2020-06-30T18:30:00.000Z\",\n                \"statusText\": \"48 Days\",\n                \"reminderColor\": \"#00BE75\"\n            },\n            {\n                \"itemId\": \"5e4132b4603c2159b3e58ac0\",\n                \"itemName\": \"2020 C&B DMP610-6TA 26\\\"\",\n                \"itemPhoto\": \"http://localhost:5000/file/trailer/5e4132b4603c2159b3e58ac0/1\",\n                \"reminderType\": \"Service Deadline\",\n                \"expiringItemId\": \"5e6a12cf776139306e8bccdb\",\n                \"expiryDate\": \"2020-06-04T18:30:00.000Z\",\n                \"statusText\": \"83 Days\",\n                \"reminderColor\": \"#00BE75\"\n            },\n            {\n                \"itemId\": \"5e4132b4603c2159b3e58ac0\",\n                \"itemName\": \"2020 C&B DMP610-6TA 26\\\"\",\n                \"itemPhoto\": \"http://localhost:5000/file/trailer/5e4132b4603c2159b3e58ac0/1\",\n                \"reminderType\": \"Service Appointment\",\n                \"expiringItemId\": \"5e6a12f7776139306e8bccdc\",\n                \"expiryDate\": \"2019-06-04T18:30:00.000Z\",\n                \"statusText\": \"282 Days\",\n                \"reminderColor\": \"#FF6C00\"\n            },\n            {\n                \"itemId\": \"5e4132b4603c2159b3e58ac3\",\n                \"itemName\": \"2019 AirTow E-14\",\n                \"itemPhoto\": \"http://localhost:5000/file/trailer/5e4132b4603c2159b3e58ac3/1\",\n                \"reminderType\": \"End Of Life\",\n                \"statusText\": \"2 Years\",\n                \"reminderColor\": \"#FF6C00\"\n            },\n            {\n                \"rentalId\": \"5e734853fd4ae72be8e7719c\",\n                \"itemId\": \"5e624533d9613b458a36cf24\",\n                \"itemName\": \"2020 Big 10 BT610SA - 1\",\n                \"itemPhoto\": \"http://localhost:5000/file/trailer/5e624533d9613b458a36cf24/1\",\n                \"reminderType\": \"Upcoming Rental\",\n                \"statusText\": \"In 5 days\",\n                \"reminderColor\": \"#00BE75\"\n            }\n        ]\n    }\n\nSample API Call : http://localhost:5000/reminders?count=5&skip=0",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Reminders data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/getReminders.js",
    "groupTitle": "Licensee_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/licensee/trailer",
    "title": "Get Trailer Details",
    "name": "LA_-_Get_Trailer_Details",
    "group": "Licensee_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn reque</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Trailer Id</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /licensee/trailer</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "trailerObj",
            "description": "<p>Object with Trailer details</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 \n\n    {\n        success: true,\n        message: \"Successfully fetched Trailers data\",\n        trailerObj: {\n            \"features\": [ \"spacious\" ],\n            \"photos\": [],\n            \"availability\": true,\n            \"_id\": \"5e3bea14d3389b3ec15be4f2\",\n            \"name\": \"Shadow Trailer\",\n            \"type\": \"cargo\",\n            \"description\": \"-83 IN WIDE -TANDEM 5200# TORSION AXLES -ALL ALUMINUM -RUBBER BUMPER \",\n            \"size\": \"38??? floor x 8??? tall x 8???5 wide\",\n            \"capacity\": \"6680\",\n            \"age\": 3,\n            \"tare\": \"5200\",\n            \"licenseeId\": \"5e395d2f784ae3441c9486bc\",\n            \"rating\": \"3\",\n            rentalCharges: {\n                \"pickUp\": [\n                    {\n                        \"duration\": 21600000,\n                        \"charges\": 54\n                    },\n                    {\n                        \"duration\": 1,\n                        \"charges\": 5\n                    }\n                ],\n                \"door2Door\": [\n                    {\n                        \"duration\": 21600000,\n                        \"charges\": 65\n                    },\n                    {\n                        \"duration\": 1,\n                        \"charges\": 6\n                    }\n                ]\n            },\n            price: \"86 AUD\",\n            rentalsList: [\n                {\n                    start: '2020-06-05T00:00:00.000+00:00',\n                    end: '2020-06-07T00:00:00.000+00:00'\n                }\n            ]\n        }\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Trailer data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/getTrailer.js",
    "groupTitle": "Licensee_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/insurance",
    "title": "Get Trailer Insurance List",
    "name": "LA_-_Get_Trailer_Insurance_List",
    "group": "Licensee_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn reque</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "itemId",
            "description": "<p>Id of the trailer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Trailers to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Trailers to skip</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /insurance</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "insuranceList",
            "description": "<p>List of Trailer Insurance records</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Successfully fetched Trailer Insurance List\",\n        insuranceList: []\n    }\n\n\nSample API Call : http://localhost:5000/insurance?itemId=368343&count=10&skip=0",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Trailer Insurance List\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/getTrailerInsurance.js",
    "groupTitle": "Licensee_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/servicing",
    "title": "Get Trailer Servicing List",
    "name": "LA_-_Get_Trailer_Servicing_List",
    "group": "Licensee_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn reque</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "itemId",
            "description": "<p>Id of the trailer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Trailers to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Trailers to skip</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /servicing</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "servicingList",
            "description": "<p>List of Trailer Servicing records</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Successfully fetched Trailer Servicing List\",\n        servicingList: []\n    }\n\n\nSample API Call : http://localhost:5000/trailers?count=5&skip=0&pincode=83448,1560&location=-111.6932,43.8477",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Trailer Servicing List\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/getTrailerServicing.js",
    "groupTitle": "Licensee_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/licensee/trailers",
    "title": "Get Trailers List",
    "name": "LA_-_Get_Trailers_List",
    "group": "Licensee_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Trailers to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Trailers to skip</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /licensee/trailers</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "trailersList",
            "description": "<p>List of Trailers</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Successfully fetched Trailer data\",\n        trailersList: []\n    }\n\nSample API Call : http://localhost:5000/trailers?count=5&skip=0&pincode=83448,1560&location=43.8477,-111.6932",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Trailers data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/getTrailers.js",
    "groupTitle": "Licensee_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/licensee/trailers/admin",
    "title": "Get Trailers List added by Admin",
    "name": "LA_-_Get_Trailers_List_added_by_Admin",
    "group": "Licensee_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /licensee/trailers/admin</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "trailersList",
            "description": "<p>List of Trailers</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        trailersList: []\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not fetch Admin Trailer Type\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/getAdminTrailers.js",
    "groupTitle": "Licensee_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/licensee/upsellitem",
    "title": "Get Upsell Item Details",
    "name": "LA_-_Get_Upsell_Item_Details",
    "group": "Licensee_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn reque</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Upsell Item Id</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /licensee/upsellItem</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "upsellItemObj",
            "description": "<p>Upsell Item details</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 \n\n    {\n        success: true,\n        message: \"Successfully fetched Upsell Item data\",\n        upsellItemObj: {\n            availability: true,\n            _id: '5e4fd5f6286df95cfbea5b09',\n            name: \"Trailers 2000 6 x 4' Universal Tonneau Cover\",\n            description: 'Universal tonneau covers are tough and made to suit most standard size 6 x 4 box trailers.This easy to fit cover is ideal for protecting against dust and water, the kit contains the cover, bow and buttons for securing the cover to the trailer',\n            rentalCharges: {\n                \"pickUp\": [\n                    {\n                        \"duration\": 21600000,\n                        \"charges\": 54\n                    },\n                    {\n                        \"duration\": 1,\n                        \"charges\": 5\n                    }\n                ],\n                \"door2Door\": [\n                    {\n                        \"duration\": 21600000,\n                        \"charges\": 65\n                    },\n                    {\n                        \"duration\": 1,\n                        \"charges\": 6\n                    }\n                ]\n            }\n            trailerId: '5e4fd5f6286df95cfbea5b07',\n            photos: [\"{HOST}/file/upsellItem/:trailerId/:photoIndex\"],\n            rating: '0/5'\n        }\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Upsell Item data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/getUpsellItem.js",
    "groupTitle": "Licensee_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/licensee/upsellitems",
    "title": "Get Upsell Items List",
    "name": "LA_-_Get_Upsell_Items_List",
    "group": "Licensee_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "trailerId",
            "description": "<p>Id of the Trailer for which Upsell Items have to be fetched</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Upsell Items to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Upsell Items to skip</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /licensee/upsellitems</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "upsellItemsList",
            "description": "<p>List of Upsell Items</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Successfully fetched Upsell Items data\",\n        upsellItemsList: []\n    }\n\nSample API Call : http://localhost:5000/upsellitems?count=5&skip=0&pincode=83448,1560&location=43.8477,-111.6932",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Upsell Items data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/getUpsellItems.js",
    "groupTitle": "Licensee_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/licensee/upsellitems/admin",
    "title": "Get Upsell Items List added by Admin",
    "name": "LA_-_Get_Upsell_Items_List_added_by_Admin",
    "group": "Licensee_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /licensee/upsellitems/admin</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "upsellItemsList",
            "description": "<p>List of Upsell Items</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        upsellItemsList: []\n    }",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not fetch Admin Upsell Item Type\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/getAdminUpsellItems.js",
    "groupTitle": "Licensee_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/licensee/financial",
    "title": "Get the Financial Summary of Trailer Rentals",
    "name": "LA_-_Get_the_Financial_Summary_of_Trailer_Rentals",
    "group": "Licensee_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "startDate",
            "description": "<p>Start Date of the period for which Financial Summary has to be calculated</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "endDate",
            "description": "<p>End Date of the period for which Financial Summary has to be calculated</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /licensee/financial data</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "financialsObj",
            "description": "<p>Object containing Financials Data</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "financialsObj[total]",
            "description": "<p>Total Amount of Rentals</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "financialsObj[invoicesList]",
            "description": "<p>List of Documents</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "financialsObj[totalByTypeList]",
            "description": "<p>Total Amount of Rentals by Type</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Successfully fetched Financial Summary\",\n        financialsObj: {\n            total: 250,\n            invoicesList: [ ],\n            totalByTypeList: [ ]\n        }\n    }\n\nSample API Call : GET http://localhost:5000/licensee/financial",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Financial Summary\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/getFinancials.js",
    "groupTitle": "Licensee_App_-_Trailer"
  },
  {
    "type": "POST",
    "url": "/insurance",
    "title": "Save Trailer Insurance details",
    "name": "LA_-_Save_Trailer_Insurance_details",
    "group": "Licensee_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "insuranceDocument",
            "description": "<p>Insurance Certificate ( File )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "reqBody",
            "description": "<p>Request JSON data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Id of the Insurance record ( application to update requests only )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "itemType",
            "description": "<p>Type of Item - Trailer or Upsell Item</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "itemId",
            "description": "<p>Id of the Trailer or Upsell Item</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "issueDate",
            "description": "<p>Date of Insurance Issue ( &quot;YYYY-MM-DD&quot; format )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "expiryDate",
            "description": "<p>Date of Insurance Expiry ( &quot;YYYY-MM-DD&quot; format )</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\ncurl --location --request POST 'http://trailer2you.herokuapp.com/insurance' \\\n--form 'reqBody={\n    \"itemId\": \"5e58914c9d61b40017de39f8\",\n    \"name\": \"Vehicle Insurance\",\n    \"issueDate\": \"2019-05-01\",\n    \"expiryDate\": \"2020-05-01\"\n}' \\\n--form 'insuranceDocument=@/home/username/Downloads/automobile-insurance.jpg'",
          "type": "json"
        }
      ]
    },
    "description": "<p>API Endpoint to be used to save Trailer Insurance details</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while saving Trailer Insurance details\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "insuranceObj",
            "description": "<p>Trailer Insurance details object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n\n{\n     success: true,\n     message: \"Successfully saved Trailer Insurance details\",\n     insuranceObj: {\n         _id: \"\", // String\n         itemId: \"\", // String\n         name: \"\", // String\n         issueDate: \"\", // String\n         expiryDate: \"\", // String\n         document: \"\" // String, URL of the document\n     }\n}",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/saveTrailerInsurance.js",
    "groupTitle": "Licensee_App_-_Trailer"
  },
  {
    "type": "POST",
    "url": "/servicing",
    "title": "Save Trailer Servicing details",
    "name": "LA_-_Save_Trailer_Servicing_details",
    "group": "Licensee_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "servicingDocument",
            "description": "<p>Servicing Certificate ( File )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "reqBody",
            "description": "<p>Request JSON data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Id of the Servicing record ( application to update requests only )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "itemType",
            "description": "<p>Type of Item - Trailer or Upsell Item</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "itemId",
            "description": "<p>Id of the Trailer or Upsell Item</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the Service</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "serviceDate",
            "description": "<p>Date of Servicing ( &quot;YYYY-MM-DD&quot; format )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nextDueDate",
            "description": "<p>Next Due Date of Servicing ( &quot;YYYY-MM-DD&quot; format )</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\ncurl --location --request POST 'http://trailer2you.herokuapp.com/servicing' \\\n--form 'reqBody={\n    \"itemId\": \"5e58914c9d61b40017de39f8\",\n    \"name\": \"Tyres-Check Tread Wear\",\n    \"serviceDate\": \"2018-06-05\",\n    \"nextDueDate\": \"2020-06-05\"\n}' \\\n--form 'servicingDocument=@/home/username/Downloads/automobile-servicing.jpg'",
          "type": "json"
        }
      ]
    },
    "description": "<p>API Endpoint to be used to save Trailer or Upsell Item Servicing details</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while saving Trailer or Upsell Item Servicing details\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "servicingObj",
            "description": "<p>Trailer Servicing details object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n\n{\n     success: true,\n     message: \"Successfully saved Trailer Servicing details\",\n     servicingObj: {\n         _id: \"\", // String\n         itemId: \"\", // String\n         name: \"\", // String\n         serviceDate: \"\", // String\n         nextDueDate: \"\", // String\n         document: \"\" // String, URL of the document\n     }\n}",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/saveTrailerServicing.js",
    "groupTitle": "Licensee_App_-_Trailer"
  },
  {
    "type": "POST",
    "url": "/upsellitem",
    "title": "Save Upsell Item data",
    "name": "LA_-_Save_Upsell_Item_data",
    "group": "Licensee_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "FilesArray",
            "optional": false,
            "field": "photos",
            "description": "<p>Photos of the Upsell Items ( Files )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "reqBody",
            "description": "<p>Request JSON data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Id of the Upsell Item ( application to update requests only )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the Upsell Item</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Type of the Upsell Item</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the Upsell Item</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "availability",
            "description": "<p>Is Upsell Item Available for Rental?</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "trailerId",
            "description": "<p>Id of the Trailer for which is reviewed by the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "adminRentalItemId",
            "description": "<p>Rental Item Id of the Admin Rental Item record for Reference</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "quantity",
            "description": "<p>Quantity of Upsell Items</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\ncurl --location --request POST 'http://trailer2you.herokuapp.com/upsellitem' \\\n--form 'reqBody={\n    \"trailerId\": \"5ea2e292c164320017c7af14\",\n\n    \"name\": \"Vinyl Cage Covers - 7 x 4\",\n\n    \"type\": \"7-4-cage-cover\",\n\n    \"description\": \"This tough vinyl cage cover tailored specifically to fit standard the trailer cage . This cover is ideal for protecting against dust and water and comes complete with bow and buttons for securing the cover to the trailer.\",\n    \n    \"availability\": true\n}' \\\n--form 'photos=@/home/username/Downloads/aluminium_folding_ramps.jpg'",
          "type": "json"
        }
      ]
    },
    "description": "<p>API Endpoint to be used to save Upsell Item</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error while saving Upsell Item\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "upsellItemObj",
            "description": "<p>Upsell Item details object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n\n{\n     success: true,\n     message: \"Successfully saved Upsell Item\",\n     upsellItemObj: {}\n}",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/saveUpsellItem.js",
    "groupTitle": "Licensee_App_-_Trailer"
  },
  {
    "type": "POST",
    "url": "/trailer",
    "title": "Save or Update Trailer Information",
    "name": "LA_-_Save_or_Update_Trailer_Information",
    "group": "Licensee_App_-_Trailer",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "FilesArray",
            "optional": false,
            "field": "photos",
            "description": "<p>Photos of the Trailer ( Files )</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "insuranceDocument",
            "description": "<p>Insurance Certificate ( File )</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "servicingDocument",
            "description": "<p>Servicing Certificate ( File )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "reqBody",
            "description": "<p>Request JSON data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Id of the Trailer ( application to update requests only )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the Trailer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "vin",
            "description": "<p>VIN of the Trailer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Type of the Trailer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the Trailer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "size",
            "description": "<p>Size of the Trailer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "capacity",
            "description": "<p>Capacity of the Trailer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "tare",
            "description": "<p>Tare of the Trailer ( Weight of the Trailer before loading goods )</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "age",
            "description": "<p>Age of the Trailer</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "features",
            "description": "<p>Features of the Trailer</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "availability",
            "description": "<p>Availability of the Trailer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "adminRentalItemId",
            "description": "<p>Rental Item Id of the Admin Rental Item record for Reference</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "upsellItems",
            "description": "<p>List of Upsell Item Ids added for Trailer</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "insurance",
            "description": "<p>Insurance Object</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "insurance[issueDate]",
            "description": "<p>Date of Insurance Issue ( &quot;YYYY-MM-DD&quot; format )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "insurance[expiryDate]",
            "description": "<p>Date of Insurance Expiry ( &quot;YYYY-MM-DD&quot; format )</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "servicing",
            "description": "<p>Servicing Object</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "servicing[name]",
            "description": "<p>Name of the Service</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "servicing[serviceDate]",
            "description": "<p>Date of Servicing ( &quot;YYYY-MM-DD&quot; format )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "servicing[nextDueDate]",
            "description": "<p>Next Due Date of Servicing ( &quot;YYYY-MM-DD&quot; format )</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\ncurl --location --request POST 'http://trailer2you.herokuapp.com/trailer' \\\n--form 'photos=@/home/user/Downloads/3500kg_car_trailer.jpg' \\\n--form 'photos=@/home/user/Downloads/2000kg_car_trailer.jpg' \\\n--form 'insurance.document=@/home/user/Downloads/automobile-insurance.jpg' \\\n--form 'servicing.document=@/home/user/Downloads/automobile-servicing.jpg' \\\n--form 'reqBody={\n    \"availability\": true,\n    \"age\": 3,\n    \"vin\": \"12345678\",\n    \"adminRentalItemId\": \"5e96b42e57576e25f1594af7\",\n        \n    \"name\": \"Tandem Axle Box Trailer\",\n    \"type\": \"cage-trailer\",\n    \"description\": \"tandem axle box trailer, this will be fitted with a cage, this will be available in 10 x 6. Attached is a photo of the trailer without the cage. The range of heavy duty hot dip galvanised trailers are made tough for Australian conditions. Whether you are carrying a load up the road or across the country you want to rely on the trailer you own to do the job. Our trailers are built to last. Australian made for Australian conditions, and come with unbeatable 2 year Warranty and FREE 2 years Roadside Assist\",\n    \"capacity\": \"6980 lbs\",\n    \"tare\": \"2920 lbs\",\n\n    \"features\": [\n        \"hot dip galvanised\",\n        \"checker plate floor\",\n        \"full chassis\",\n        \"longer drawbar\",\n        \"jockey wheel clamp\",\n        \"spare wheel bracket\",\n        \"new wheels and tyres\",\n        \"LED lights\",\n        \"magnetic trailer plug\"\n    ],\n\n    \"size\": \"6'\\'' x 4'\\'' box trailer (nominal size 1800mm x 1200mm) with 300mm deep sides.  7'\\'' x 4'\\'' box trailer (nominal size 2100mm x 1200mm) with 400mm deep sides.\",\n        \n    \"upsellitems\": [\"5ec7f1f960e1475bc50b3003\"],\n        \n    \"insurance\": {\n        \"issueDate\": \"2019-11-01\",\n        \"expiryDate\": \"2020-11-01\"\n    },\n    \"servicing\": {\n        \"serviceDate\": \"2019-11-01\",\n        \"nextDueDate\": \"2020-11-01\",\n        \"name\": \"Oil Refill\"\n    }\n}'",
          "type": "json"
        }
      ]
    },
    "description": "<p>API Endpoint that can used to save or update Trailer data</p> <p>Request Headers</p> <ul> <li>'Content-Type: application/json'</li> </ul> <p>Request Body ( Example )  ( request.body )</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n\n   {\n        success: false,\n        message: \"Error while saving Trailer record\",\n        errorsList: []\n   }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Trailer",
            "description": "<p>details object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 \n\n   {\n        success: true,\n        message: \"Successfully saved Trailer record\",\n        trailerObj: {\n            _id: ObjectId(\"5e4132b4603c2159b3e58ac0\")\n            name: \"2020 C&B DMP610-6TA 26\\\"\",\n            vin: \"123456789\",\n            type: \"dump\",\n            description:\n                \"2 5/16\\\" ADJUSTABLE COUPLER, 8000# JACK, LOOSE RAMPS, SCISSOR HOIST\",\n            size: \"Length: 10' Width: 6'\",\n            capacity: \"6980 lbs\",\n            tare: \"2920 lbs\",\n            age: 4,\n\n            features: [\n                \"2 5/16\\\" ADJUSTABLE COUPLER\",\n                \"8000# JACK\",\n            ],\n\n            availability: true,\n            licenseeId: mongoose.Types.ObjectId(\"5e41314d603c2159b3e58aab\"),\n\n            photos: [\n               \"{HOST}/file/trailer/:trailerId/:photoIndex\"\n            ]\n        }\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/saveTrailer.js",
    "groupTitle": "Licensee_App_-_Trailer"
  },
  {
    "type": "GET",
    "url": "/rental/locations",
    "title": "Get Rental Item Locations",
    "name": "LA_-_Get_Rental_Item_Locations",
    "group": "Licensee_App_-_Trailer_Rental",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn reque</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "rentalId",
            "description": "<p>ID of the Rental Record for which Rental has to be tracked</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Tracking for &quot;pickup&quot; or &quot;dropoff&quot;</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to get Rental Item Locations</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while fetching Rental Item Location\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "locationsList",
            "description": "<p>List of Locations</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully fetched Rental Item Location\",\n        \"locationsList\": [\n            {\n                \"location\": [151.2172, 33.8131],\n                \"_id\": \"5e6f799914cad8421359187b\",\n                \"rentalId\": \"5e6893b03decce1dfd118021\",\n                \"createdAt\": \"2020-03-16T13:05:29.121Z\",\n                \"__v\": 0\n            },\n            {\n                \"location\": [150.2172, 32.8131],\n                \"_id\": \"5e6f7acfeed91842de605e9e\",\n                \"rentalId\": \"5e6893b03decce1dfd118021\",\n                \"createdAt\": \"2020-03-16T13:10:39.934Z\",\n                \"__v\": 0\n            }\n        ]\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/getRentalItemLocation.js",
    "groupTitle": "Licensee_App_-_Trailer_Rental"
  },
  {
    "type": "GET",
    "url": "/rental/requests",
    "title": "Get Trailer or Upsell Item Rental or Upsell Item Buy Request data",
    "name": "LA_-_Get_Trailer_or_Upsell_Item_Rental_or_Upsell_Item_Buy_Request_data",
    "group": "Licensee_App_-_Trailer_Rental",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Rentals data to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Rentals data to skip</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "upcoming",
            "description": "<p>Do fetch Upcoming data or Past data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Type of Rental Request - &quot;rental&quot;, &quot;extension&quot;, &quot;reschedule&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "approved",
            "description": "<p>Fetch Results based on Aproval Status ( 0 : pending, 1: approved, 2: rejected )</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "itemId",
            "description": "<p>Trailer ID or Upsell Item ID</p>"
          }
        ]
      }
    },
    "description": "<p>Get Trailer or Upsell Item Rental or Upsell Item Buy Requests</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "requestList",
            "description": "<p>List of Rental Requests</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        requestList: []\n\nSample API Call : http://localhost:5000/rentals?count=5&skip=0",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "\nHTTP/1.1 400\n{\n    success: false,\n    message: \"Error occurred while fetching Rental Requests\",\n    errorsList: [\"Error occurred while fetching Rental Requests\"]\n}\n\nHTTP/1.1 400\n{\n    success: false,\n    message: \"Missing Licensee ID\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/getRentalRequests.js",
    "groupTitle": "Licensee_App_-_Trailer_Rental"
  },
  {
    "type": "GET",
    "url": "/rental/details",
    "title": "Get Trailer or Upsell Item Rental or Upsell Item Buy data",
    "name": "LA_-_Get_Trailer_or_Upsell_Item_Rental_or_Upsell_Item_Buy_data",
    "group": "Licensee_App_-_Trailer_Rental",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the Rental Data to fetch</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /rental/details data</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "rentalObj",
            "description": "<p>Rental Details object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        rentalObj: {}\n    }\n\nSample API Call : http://localhost:5000/rentals?id=122hgd3232gdh",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not fetch Invoice Details\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/getRentalDetails.js",
    "groupTitle": "Licensee_App_-_Trailer_Rental"
  },
  {
    "type": "GET",
    "url": "/rentals/list",
    "title": "Get Trailer or Upsell Item Rental or Upsell Item Buy data",
    "name": "LA_-_Get_Trailer_or_Upsell_Item_Rental_or_Upsell_Item_Buy_data",
    "group": "Licensee_App_-_Trailer_Rental",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>Count of Rentals data to fetch</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skip",
            "description": "<p>Number of Rentals data to skip</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "upcoming",
            "description": "<p>Do fetch Upcoming data or Past Data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "itemId",
            "description": "<p>Trailer ID or Upsell Item ID</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint GET /rentals/list data</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "rentalsList",
            "description": "<p>List of Rentals</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200\n    {\n        success: true,\n        message: \"Success\",\n        rentalsList: []\n    }\n\nSample API Call : http://localhost:5000/rentals?count=5&skip=0",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Could not fetch Invoices List\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/getRentalsList.js",
    "groupTitle": "Licensee_App_-_Trailer_Rental"
  },
  {
    "type": "POST",
    "url": "/discount",
    "title": "Save Discount for Trailers or Upsell Items",
    "name": "LA_-_Save_Discount_for_Trailers_or_Upsell_Items",
    "group": "Licensee_App_-_Trailer_Rental",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "itemType",
            "description": "<p>Type of item - &quot;trailer&quot; or &quot;upsellitem&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "itemId",
            "description": "<p>Id of the Trailer/UpsellItem for which is rated by the User</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "chargeType",
            "description": "<p>Type of a Discount - &quot;flat&quot; or &quot;percentage&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "charge",
            "description": "<p>Discount Value flat or percentage</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Discount for Trailers or Upsell Items</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while saving Discount record\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "discountObj",
            "description": "<p>Discount details object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n{\n     success: true,\n     message: \"Successfully saved Discount record\",\n     discountObj: {\n            _id: '5e4fa796c6091d40ee15aa91',\n            itemId: '5e4fa796c6091d40ee15aa8f',\n            itemType: 'trailer',\n            chargeType: 'flat',\n            charge: 10\n     }\n}",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/saveDiscount.js",
    "groupTitle": "Licensee_App_-_Trailer_Rental"
  },
  {
    "type": "POST",
    "url": "/rental/location",
    "title": "Save Rental Item Location",
    "name": "LA_-_Save_Rental_Item_Location",
    "group": "Licensee_App_-_Trailer_Rental",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "rentalId",
            "description": "<p>Rental/invoice ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>Location Coordinates [latitude, longitude]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Tracking for &quot;pickup&quot; or &quot;dropoff&quot;</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Rental Item Location</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while updating Rental Item Location\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Successfully updated Rental Item Location\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/saveRentalItemLocation.js",
    "groupTitle": "Licensee_App_-_Trailer_Rental"
  },
  {
    "type": "POST",
    "url": "/rental/location/track",
    "title": "Save Rental Item Location Tracking Start data",
    "name": "LA_-_Save_Rental_Item_Location_Tracking_Start_data",
    "group": "Licensee_App_-_Trailer_Rental",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "driverLicenseScan",
            "description": "<p>Scan of Driver License ( File ) [ for type=&quot;dropoff&quot; &amp; action=&quot;end&quot; only ]</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "reqBody",
            "description": "<p>Request JSON data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "rentalId",
            "description": "<p>Rental/invoice ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Tracking for &quot;pickup&quot; or &quot;dropoff&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "action",
            "description": "<p>Tracking Action ( &quot;start&quot; or &quot;end&quot; )</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\ncurl --location --request POST 'http://localhost:5000/rental/location/track' \\\n--form 'reqBody={\n    \"rentalId\": \"5e6893b03decce1dfd118021\",\n    \"type\": \"dropoff\",\n    \"action\": \"start\"\n}' \\\n--form 'driverLicenseScan=@/home/username/Downloads/driver_license_sample.jpeg'",
          "type": "json"
        }
      ]
    },
    "description": "<p>API Endpoint to be used to save Rental Item Location Tracking Start data</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n    {\n        success: false,\n        message: \"Error occurred while saving Rental Item Location Tracking Start data\",\n        errorsList: []\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "locationObj",
            "description": "<p>Location object having pickUpLocation or dropOffLocation</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\",\n        locationObj: {}\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/saveRentalItemLocationStartTracking.js",
    "groupTitle": "Licensee_App_-_Trailer_Rental"
  },
  {
    "type": "POST",
    "url": "/rental/approval",
    "title": "Save Rental Request Approval data",
    "name": "LA_-_Save_Rental_Request_Approval_data",
    "group": "Licensee_App_-_Trailer_Rental",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "rentalId",
            "description": "<p>Rental Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "revisionId",
            "description": "<p>Id of Rental Revision</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "approvalStatus",
            "description": "<p>Approval Status of the Rental Request</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "NOPAYMENT",
            "description": "<p>Add this parameter when you want to skip payment ( value = true )</p>"
          }
        ]
      }
    },
    "description": "<p>API Endpoint to be used to save Rental Request Approval</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "\nHTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while approving/rejecting Rental Request\",\n     errorsList: []\n }\n\n HTTP/1.1 400 \n {\n     success: false,\n     message: \"Error in Stripe Payments\",\n     error: \"authentication_required\",\n     paymentMethod: err.raw.payment_method.id,\n     clientSecret: err.raw.payment_intent.client_secret,\n     amount: amountToCharge,\n     card: {\n         brand: err.raw.payment_method.card.brand,\n         last4: err.raw.payment_method.card.last4\n     }\n }\n\n HTTP/1.1 400\n {\n     success: false,\n     message: \"Error in Stripe Payments\",\n     error: err.code,\n     clientSecret: err.raw.payment_intent.client_secret\n }\n\n HTTP/1.1 400\n {\n     success: false,\n     message: \"Error in Stripe Payments\",\n     error: err\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\"\n        // message: \"Successfully approved/rejected Rental Extension Request\"\n        // message: \"Successfully approved/rejected Rental Reschedule Request\"\n    }",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/manageRentalApproval.js",
    "groupTitle": "Licensee_App_-_Trailer_Rental"
  },
  {
    "type": "POST",
    "url": "/rental/status",
    "title": "Save Rental Status Update data",
    "name": "LA_-_Save_Rental_Status_Update_data",
    "group": "Licensee_App_-_Trailer_Rental",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization token sent as a response to signIn request</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "driverLicenseScan",
            "description": "<p>Scan of Driver License ( File ) [ for status=&quot;delivered&quot; only ]</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "reqBody",
            "description": "<p>Request JSON data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "rentalId",
            "description": "<p>Rental Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Status of the dispatched items ( &quot;dispatched&quot;, &quot;returned&quot;, &quot;return-started&quot;, &quot;delivered&quot; )</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\nRental Status Update Body\n\n    curl --location --request POST 'http://localhost:5000/rental/status' \\\n    --form 'reqBody={\n        \"rentalId\": \"5ea82c7ec24cc540f8de07fa\", \n        \"status\": \"delivered\"\n    }' \\\n    --form 'driverLicenseScan=@/home/username/Downloads/driver_license_sample.jpeg'",
          "type": "json"
        }
      ]
    },
    "description": "<p>API Endpoint to be used to save Rental Status Update</p>",
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400\n {\n     success: false,\n     message: \"Error occurred while updating Rental Status\",\n     errorsList: []\n }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Success Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "- Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n    {\n        success: true,\n        message: \"Success\"",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/nimap/neha/trailer-backend/app/controllers/licensee/trailers/manageRentalStatus.js",
    "groupTitle": "Licensee_App_-_Trailer_Rental"
  }
] });
