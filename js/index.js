// Variables
var user_input;
var mobile_input;
var contactsPanelList = document.getElementById("contacts-container-list");
var db = null;

var contacts_obj = [];
var contacts = [];

function deviceReady() {
  // Debug
  alert("Working!");

  // SQLITE DB
  db = window.sqlitePlugin.openDatabase({
    name: "contacts.db",
    location: "default",
  });

  // Function calls
  addContact();
}

function manageContacts() {
  db.transaction(
    function (tx) {
      tx.executeSql(
        "SELECT contacts FROM code",
        [],
        function (tx, rs) {
          // loadContacts(rs.rows.item(0).contacts);
          console.log(rs.rows.item(0).c);
        },
        function (tx, error) {
          tx.executeSql("CREATE TABLE IF NOT EXISTS code (c)");
          tx.executeSql("INSERT INTO code VALUES (0)");

          return false;
        }
      );
    },
    function (error) {
      console.log("Transaction ERROR: " + error.message);
    },
    function () {
      console.log("Populated db OK");
    }
  );
}

function addContact() {
  manageContacts();

  $("#add").click(function () {
    user_input = $("#user-input").val();
    mobile_input = $("#mobile-input").val();

    if (user_input == "" || mobile_input == "") {
      alert("Please fill the Name & Mobile number for the contact");
      return;
    }

    if (contacts.length <= 0) {
      let objName = "contact_0";
      let objId = 0;
      contacts.push(objId);
      contacts_obj.push(new Contact(objName, user_input, mobile_input));
      createNewElement(objName, user_input, mobile_input);

      db.transaction(function (tx) {
        tx.executeSql("UPDATE code SET c=?", [contacts_obj]);
      });
    } else {
      let contacts_length = contacts.length;
      let contacts_last_index = contacts_length - 1;
      let contacts_new_index = contacts_last_index + 1;

      let objName = `contact_${contacts_new_index}`;
      let objId = contacts_new_index;
      contacts.push(objId);
      contacts_obj.push(new Contact(objName, user_input, mobile_input));
      createNewElement(objName, user_input, mobile_input);

      db.transaction(function (tx) {
        tx.executeSql("UPDATE code SET c=?", [contacts_obj]);
      });
    }
  });
}

function createNewElement(cID, cName, cNumber) {
  element = `<li id="${cID}">Contact Name: ${cName} | Mobile Number: ${cNumber} <a onclick="DeleteTask(event)"><span class="glyphicon glyphicon-remove remove"></span></a></li>`;
  contactsPanelList.insertAdjacentHTML("afterbegin", element);
}

function loadContacts(obj) {
  obj.forEach((e) => {
    element = `<li id="${obj.contact_identifier}">Contact Name: ${obj.contact_name} | Mobile Number: ${obj.contact_number} <a onclick="DeleteTask(event)"><span class="glyphicon glyphicon-remove remove"></span></a></li>`;
    contactsPanelList.insertAdjacentHTML("afterbegin", element);
  });
}

function DeleteTask(event) {
  const element = event.target;

  contacts_obj.forEach((e) => {
    if (e.identifier == $(element).parent().parent().attr("id")) {
      var removeE = [e.identifier];
      cordova.plugins.notification.local.schedule({
        title: "Contacts",
        text: `${
          $(e.contact_name).parent().parent().id
        } contact has been deleted`,
        foreground: true,
      });
    }
  });

  contacts_obj = contacts_obj.filter((item) => !removeE.includes(item));
  $(element).parent().parent().remove();
  db.transaction(function (tx) {
    tx.executeSql("UPDATE code SET c=?", [contacts_obj]);
  });
}

class Contact {
  constructor(identifier, name, number) {
    this.identifier = identifier;
    this.contact_name = name;
    this.contact_number = number;
  }

  ToString() {
    return {
      ContactIdentifier: this.identifier,
      ContactName: this.contact_name,
      ContactNumber: this.contact_number,
    };
  }
}

$(document).on("deviceready", deviceReady);
