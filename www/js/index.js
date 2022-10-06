// Variables
var user_input;
var mobile_input;
var contactsPanelList = document.getElementById("contacts-container-list");
var db = null;
var removeE;

var contacts_obj = [];
var contacts = [];

function deviceReady() {
  // Debug
  alert("Working!");

  // Function calls
  manageContacts();
  addContact();
}

function manageContacts() {
  getContactsObj();
  getContacts();
  setTimeout(loadContacts, 500);
}

function getContactsObj() {
  NativeStorage.getItem(
    "con_o",
    (data) => {
      contacts_obj = data;
      console.log("Saved contacts objects found and imported");
    },
    () => {
      contacts_obj = [];
      console.log("No saved contacts objects found");
    }
  );
}

function getContacts() {
  NativeStorage.getItem(
    "con",
    (data) => {
      contacts = data;
      console.log("Saved contacts found and imported");
    },
    () => {
      contacts = [];
      console.log("No saved contacts found");
    }
  );
}

function addContact() {
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

      NativeStorage.setItem("con_o", contacts_obj);
      NativeStorage.setItem("con", contacts);

      console.log("A client has been added");
    } else {
      let contacts_length = contacts.length;
      let contacts_last_index = contacts_length - 1;
      let contacts_new_index = contacts_last_index + 1;

      let objName = `contact_${contacts_new_index}`;
      let objId = contacts_new_index;
      contacts.push(objId);
      contacts_obj.push(new Contact(objName, user_input, mobile_input));
      createNewElement(objName, user_input, mobile_input);

      NativeStorage.setItem("con_o", contacts_obj);
      NativeStorage.setItem("con", contacts);

      console.log("A client has been added");
    }
  });
}

function createNewElement(cID, cName, cNumber) {
  element = `<li id="${cID}">Contact Name: ${cName} | Mobile Number: ${cNumber} <a onclick="DeleteTask(event)"><span class="glyphicon glyphicon-remove remove"></span></a></li>`;
  contactsPanelList.insertAdjacentHTML("afterbegin", element);
}

function loadContacts() {
  contacts_obj.forEach((obj) => {
    element = `<li id="${obj.identifier}">Contact Name: ${obj.contact_name} | Mobile Number: ${obj.contact_number} <a onclick="DeleteTask(event)"><span class="glyphicon glyphicon-remove remove"></span></a></li>`;
    contactsPanelList.insertAdjacentHTML("afterbegin", element);
  });
}

function DeleteTask(event) {
  const element = event.target;

  contacts_obj.forEach((e) => {
    if (e.identifier == $(element).parent().parent().attr("id")) {
      let id = e.identifier.indexOf("_");
      id = e.identifier.substr(e.identifier.indexOf("_") + 1);

      removeE = [parseInt(id)];

      cordova.plugins.notification.local.schedule({
        title: "Contacts",
        text: `${e.contact_name} contact has been deleted`,
        foreground: true,
      });

      $(element).parent().parent().remove();
      contacts_obj = contacts_obj.filter((item) => !removeE.includes(item));

      const indexOfObject = contacts_obj.findIndex((object) => {
        return object.identifier == e.identifier;
      });

      contacts_obj.splice(indexOfObject, 1);

      contacts = contacts.filter((item) => !removeE.includes(item));

      NativeStorage.setItem("con_o", contacts_obj);
      NativeStorage.setItem("con", contacts);

      console.log(`${e.contact_name} contact has been deleted`);
    }
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
