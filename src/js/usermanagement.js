// VP & GR

// Anlegen der DataTable zur Anzeige von Benutzerdaten (GR)
let accountsTable = null;

$(document).ready(function(){
    accountsTable = $('#accountsTable').DataTable({
        "responsive": true,
        "autowidth": true,
        "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
        "ordering": false,
        "ajax": {
            "url": "src/php/_ajax/ajax.listAccounts.php",
            "dataSrc": "accounts"
        },
        "columns": [
            { "data": "first_name" },
            { "data": "last_name" },
            { "data": "email" },
            { 
                "data": null,
                render: function (row) {
                    if (row.is_teacher && row.is_admin) {
                        return "Admin & Lehrer";
                    } else if (row.is_teacher && !row.is_admin) {
                        return "Lehrer";
                    } else if (!row.is_teacher && row.is_admin) {
                        return "Admin";
                    } else {
                        return "-";
                    }
                } 
            },
            { 
                searchable: false,
                orderable: false,
                "data": "id",
                render: function (account) { 
                    let rtn = '<div class="btn-group"><button type="button" class="btn btn-primary" name="editAccount" data-id="'+account+'"><i class="fas fa-pen"></i></button>';
                    if (getCookie('UserLogin') != account) {
                        rtn += '<button type="button" class="btn btn-danger" name="deleteAccount" data-id="'+account+'"><i class="fas fa-trash"></i></button></div>';
                    } else {
                        rtn += '</div>';
                    }
                    return rtn;
                }
            }
        ],
        fixedHeader: {
            header: true,
            footer: true
        },
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.11.3/i18n/de_de.json"
        }
    });

    let helpText = "\
    <p><i class='fas fa-info-circle'></i> Die Benutzerverwaltung ist nur f??r Administratoren aufrufbar.</p>\
    <h5>Benutzer hinzuf??gen</h5>\
    <p>In diesem Fenster m??ssen alle Felder ausgef??llt sein. Weiterhin muss mindestens ein Kontrollk??stchen f??r eine Rolle ausgew??hlt sein! \
    Das Passwort muss mindestens 8 Zeichen lang sein und es muss eine g??ltige E-Mail Adresse eingegeben werden! Durch einen Klick auf den Button speichern \
    wird der Benutzer hinzugef??gt.</p>\
    <h5>Benutzertabelle</h5>\
    <p>Auf dieser Seite werden alle Benutzer aufgelistet.</p>\
    <p>Anhand des 'Suche' Feldes kann nach inhalten von jeder Tabellenspalte gesucht werden. Die Anzahl der Benutzer, die auf einen Blick sichtbar sind\
    kann mit einer Auswahl eines Eintrages auf dem Feld 'Zeilen anzeigen' ge??ndert werden.\
    Mit den Buttons 'Zur??ck' und 'N??chste' kann die Seite gewechselt werden um weitere Tabelleneintr??ge ansehen zu k??nnen.</p>\
    <h5>Benutzer ??ndern</h5>\
    <p>Mit einem Klick auf den blauen Button mit dem Stift Symbol kann der Benutzer ver??ndert werden. Dies funktioniert genauso wie beim hinzuf??gen der Benutzer.</p>\
    <h5>Benutzer l??schen</h5>\
    <p>Mit einem Klick auf den roten Button mit dem M??lleimer Symbol kann die Klausur nach best??tigung einer weiteren Sicherheits-Meldung gel??scht werden.</p>\
    <p><i class='fas fa-info-circle'></i> Dem eigenen Benutzer kann nicht die Administrator Rolle entzogen werden, dies funktioniert aber durch einen weiteren Administrator. \
    Weiterhin kann der eigene Benutzer nur durch einen weiteren Administrator gel??scht werden.</p>\
    <p><i class='fas fa-info-circle'></i> Falls der eigene Benutzer ge??ndert wird, wird man automatisch ausgeloggt und muss sich neu anmelden.</p>\
    <h5>Benutzerliste importieren</h5>\
    <p>In diesem Fenster kann eine CSV Datei importiert werden die folgendes Format besitzen muss:</p>\
    <ul>\
    <li>firstname</li>\
    <li>lastname</li>\
    <li>email</li>\
    <li>password</li>\
    <li>isadmin</li>\
    <li>isteacher</li>\
    </ul>\
    <p><i class='fas fa-info-circle'></i> Die Felder isadmin und isteacher m??ssen mit 1 oder 0 gef??llt sein. Sie dienen dazu die Rolle Admin (isadmin) oder Lehrer (isteacher) zu setzen \
    hierbei steht der Wert '1' daf??r, dass der Benutzer diese rolle besitzt und '0', dass er diese Rolle nicht besitzt.</p>\
    <p><i class='fas fa-info-circle'></i> Das Passwort muss mindestens 8 Zeichen enthalten.</p>\
    <p><i class='fas fa-info-circle'></i> Die E-Mail Adresse muss eine g??ltige Adresse sein.</p>\
    <p><i class='fas fa-info-circle'></i> Benutzer die bereits vorhanden sind, werden ??bersprungen</p>\
    <p>Mit dem Knopf 'Log anzeigen' kann eingesehen werden, welche Benutzer importiert werden konnten und welche nicht.</p>\
    ";
    $('#helpText').html(helpText);
});

// Fenster zum Hinzuf??gen eines neuen Benutzers anzeigen (GR)
$("#addUser").on("click", function() {
    $("#addUserModal").modal("show");
});

// Fenster zum Importieren von mehreren Benutzern per CSV-Datei anzeigen (GR)
$("#importUser").on("click", function() {
    $("#importUserModal").modal("show");
});

// Dateinamen im Label anzeigen (VP)
$('input#inputUpload').on('change', function (e) {
    //get the file name
    let fileName = e.target.files[0].name;
    //replace the "Choose a file" label
    $(this).next('.custom-file-label').html(fileName);
});

// Import ausf??hren, wenn der Benutzer auf den "Importieren"-Button klickt (GR)
$('button#importUsers').on('click', function () {
    // Get the selected file(s) and store them in the files variable --- [0].files; because we just want to have one file
    let fd = new FormData();
    let files = $('#inputUpload')[0].files;

	// Add the file to the form data variable
    if (files.length > 0) {
        fd.append('file', files[0]);
    } else {
        triggerResponseMsg('error', $('.emptyInputFile').html());
        return false;
    }

    $.ajax({
        type: 'POST',
        url: 'src/php/_ajax/ajax.userImport.php',
        contentType: false,
        processData: false,
        data: fd,
        success: function (rtn) {
			// Parse the response JSON from php to an object
            let obj = JSON.parse(rtn);
			// Upload Successful
            if (obj.status == 'success') {
                if (obj.successCount == 0 && obj.failCount > 0) {
                    triggerResponseMsg('info', 'Die Datei enth??lt nur bereits vorhandene Benutzer!');
                } else {
                    triggerResponseMsg('success', 'Die Datei wurde erfolgreich importiert. '+ obj.successCount + " erfolgreich, " + obj.failCount + " fehlgeschlagen.");
                    reloadTable();
                    $("#importUserModal").modal("hide");
                }
            } else {
                if (obj.status == "type_error") {
					// File is not of the correct type
                    triggerResponseMsg('error', 'Die Datei hat nicht den richtigen Dateityp!');
                } else if (obj.status == "wrong_format") {
					// File wrong format
                    triggerResponseMsg('info', 'Die Datei ist nicht im richtigen Format!');
                } else {
                    // General File upload error
                    triggerResponseMsg('error', 'Die Datei konnte nicht hochgeladen werden!');
                }
            }

			// Clear the upload file input
            $('#inputUpload').val('');
            $('.custom-file-label').html('Datei ausw??hlen');
        }
    });
});   

// Fenster zum Bearbeiten eines existierenden Benutzers anzeigen (GR)
$("#accountsTable").on("click", 'button[name="editAccount"]', function() {
    let button = $(this);
    $('#editUserModal').find('button[name="save"]').attr('data-id', button.attr('data-id'));
    $('#editUserModal').modal('show');
});

// Fenster zum L??schen eines existierenden Benutzers anzeigen (GR)
$('#deleteUserModal').find('button[name="delete"]').on('click', function () {
    deleteUser($('#deleteUserModal').find('button[name="delete"]').attr('data-id'));
});

// Benutzerdaten holen, um sie im Bearbeiten-Fenster anzuzeigen (GR)
$('#editUserModal').on('shown.bs.modal', function() {
    getUserData($("#editUserModal").find('button[name="save"]').attr('data-id'));
    $('#passwordChange').prop('checked', false);
});

// Beim ??ndern der CheckBox "Passwort ??ndern?" pr??fen, ob es aktiviert/deaktiviert ist und Felder aktivieren/deaktivieren (GR)
$('#passwordChange').on("change", function () {
    if ($('#passwordChange').is(':checked')) {
        $('#inputEditPassword').prop('disabled', false);
        $('#inputEditConfirmPassword').prop('disabled', false);
        $('#inputEditPassword').val("");
        $('#inputEditConfirmPassword').val("");
    } else {
        $('#inputEditPassword').prop('disabled', true);
        $('#inputEditConfirmPassword').prop('disabled', true);
        $('#inputEditPassword').val("--------");
        $('#inputEditConfirmPassword').val("--------");
    }
});

// Beim Klicken auf den "Speichern"-Button, Funktion zum ??bernehmen der ??nderungen aufrufen (GR)
$('#editUserModal').find('button[name="save"]').on('click', function() {
    editUser($("#editUserModal").find('button[name="save"]').attr('data-id'));
});

$('#inputEditEmail, #inputEditFirstName, #inputEditLastName, #inputEditPassword, #inputEditConfirmPassword').keypress(function(e) {
    if (e.which == 13) {
        editUser($("#editUserModal").find('button[name="save"]').attr('data-id'));
    }
});

// Zur??cksetzen aller Felder des "Bearbeiten"-Fensters (GR)
$('#editUserModal').on('hidden.bs.modal', function() {
    $('#editUserModal').find('.overlay').show();
    $('#inputEditEmail').val("");
    $('#inputEditFirstName').val("");
    $('#inputEditLastName').val("");
    $('#isAdminEdit').attr('checked', false);
    $('#isTeacherEdit').attr('checked', false);
    $('#isAdminEdit').prop('disabled', false);
    $('#isTeacherEdit').prop('disabled', false);
    $('#inputEditPassword').val("--------");
    $('#inputEditConfirmPassword').val("--------");
    $('#inputEditPassword').prop('disabled', true);
    $('#inputEditConfirmPassword').prop('disabled', true);
    $('#passwordChange').prop('checked', false);
});

// "L??schen"-Fenster anzeigen, wenn auf den "L??schen"-Button geklickt (GR)
$("#accountsTable").on("click", 'button[name="deleteAccount"]', function() {
    let button = $(this);
    $('#deleteUserModal').find('button[name="delete"]').attr('data-id', button.attr('data-id'));
    $('#deleteUserModal').modal('show');
});

// Beim Klicken auf den "Speichern"-Button beim hinzuf??gen eines neuen Benutzers, Funktion zur Erfassung der Daten des neuen Benutzers aufrufen (GR)
$("#saveNewAccount").on("click", function() {
    addNewUser();  
});

$('#inputEmail, #inputFirstName, #inputLastName, #inputPassword, #inputConfirmPassword').keypress(function(e) {
    if (e.which == 13) {
        addNewUser();  
    }
});

// Funktion zur Erfassung der Daten des neuen Benutzers (GR)
function addNewUser()
{
   
    let emailValue = $('#inputEmail').val().trim();
    let firstnameValue = $('#inputFirstName').val().trim();
    let lastnameValue = $('#inputLastName').val().trim();
    let passwordValue = $('#inputPassword').val();
    let confirmPasswordValue = $('#inputConfirmPassword').val();
    let isAdminValue = $('#isAdmin').is(":checked") ? true : false;
    let isTeacherValue = $('#isTeacher').is(":checked") ? true : false;

    let errorMsg = null;
    if (!isMail(emailValue)) {
        errorMsg = $('.errorMail').html();
    } // Pr??fung auf ??bereinstimmende Passw??rter
    if (passwordValue != confirmPasswordValue) {
        errorMsg = $('.errorPassword').html();
    } // Pr??fung auf Passwortl??nge von mind. 8 Zeichen
    if (passwordValue.length < 8) {
        errorMsg = $('.errorPasswordLength').html();
    } // Pr??fung auf keine gew??hlten Rollen
    if (!isAdminValue && !isTeacherValue) {
        errorMsg = $('.errorRole').html();
    } // Pr??fung auf fehlende Eingaben
    if (emailValue == "" || firstnameValue == "" || lastnameValue == "" || passwordValue == "" || confirmPasswordValue == "") {
        errorMsg = $('.missingInput').html();
    }

    // Ausgabe der Fehlermeldung
    if (errorMsg != null) {
        triggerResponseMsg('error', errorMsg);
        return false;
    }

    // POST-Befehl an den Server
    $.post(
        'src/php/_ajax/ajax.queryUser.php',
        {
            data: {
                action: 'insert',
                email: emailValue,
                firstname: firstnameValue,
                lastname: lastnameValue,
                password: passwordValue,
                isAdmin: isAdminValue,
                isTeacher: isTeacherValue
            },
        },
        function(rtn) {
            try {
                let obj = JSON.parse(rtn);
                if (obj.success) {

                    // Ausgabe der Erfolgsmeldung
                    triggerResponseMsg('success', $('.successCreateUser').html());
                    if(true) {

                    }
                } else {
                    // Ausgabe der Fehlermeldung
                    if (obj.error == "insert") {
                        triggerResponseMsg('error', $('.errorCreateUser').html());
                    } else {
                        triggerResponseMsg('error', $('.errorDuplicate').html());
                    }
                    
                }
                // Fenster zum Hinzuf??gen eines neuen Benutzers nach erfolgreicher Erstellung schlie??en und DataTable aktualisieren
                $("#addUserModal").modal("hide");
                reloadTable();

            } catch(e) {
                console.log(e);
                triggerResponseMsg('error', $('.errorCreateUser').html());
            }
        }
    );
}

// Funktion zum Abruf von Benutzerdaten ??ber die Benutzer-ID (GR)
function getUserData(id) {
    $.post(
        'src/php/_ajax/ajax.getUser.php',
        {
            data: {
                id: id
            },
        },
        function (rtn) {
            try {
                let obj = JSON.parse(rtn);
                console.log(obj);
                if (obj.success) {
                    // Abruf der Benutzerrolle, um den Status der CheckBox "Admin" anzupassen
                    if (obj.user.is_admin == 1) {
                        $('#isAdminEdit').attr('checked', true);
                        if (getCookie('UserLogin') == id) {
                            $('#isAdminEdit').prop('disabled', true);
                        }
                    }  else {
                        $('#isAdminEdit').attr('checked', false);
                    }
                    
                    // Abruf der Benutzerrolle, um den Status der CheckBox "Lehrer" anzupassen
                    if (obj.user.is_teacher == 1) {
                        $('#isTeacherEdit').attr('checked', true);
                    } else {
                        $('#isTeacherEdit').attr('checked', false);
                    }

                    //Zur??ckbekommene Werte den Feldern zuteilen
                    $('#inputEditEmail').val(obj.user.email);
                    $('#inputEditFirstName').val(obj.user.first_name);
                    $('#inputEditLastName').val(obj.user.last_name);
                    $('#editUserModal').find('.overlay').fadeOut(500);
                } 
            } catch (e) {
                console.log(e);
            }
        }
    );
}

// Funktion zum ??bernehmen der ??nderungen im "Bearbeiten"-Fenster (GR)
function editUser(id)
{
   
    let emailValue = $('#inputEditEmail').val().trim();
    let firstnameValue = $('#inputEditFirstName').val().trim();
    let lastnameValue = $('#inputEditLastName').val().trim();
    let passwordValue = $('#inputEditPassword').val();
    let confirmPasswordValue = $('#inputEditConfirmPassword').val();
    let isAdminValue = $('#isAdminEdit').is(":checked") ? true : false;
    let isTeacherValue = $('#isTeacherEdit').is(":checked") ? true : false;
    let changePassword = $('#passwordChange').is(":checked") ? true : false;

    let errorMsg = null;
    if (!isMail(emailValue)) {
        errorMsg = $('.errorMail').html();
    }
    if (passwordValue != confirmPasswordValue && changePassword) {
        errorMsg = $('.errorPassword').html();
    }
    if (passwordValue.length < 8 && changePassword) {
        errorMsg = $('.errorPasswordLength').html();
    }
    if (!isAdminValue && !isTeacherValue) {
        errorMsg = $('.errorRole').html();
    }
    if (emailValue == "" || firstnameValue == "" || lastnameValue == "" || (changePassword && (confirmPasswordValue == "" || passwordValue == ""))) {
        errorMsg = $('.missingInput').html();
    }

    if (errorMsg != null) {
        triggerResponseMsg('error', errorMsg);
        return false;
    }

    $.post(
        'src/php/_ajax/ajax.queryUser.php',
        {
            data: {
                id: id,
                action: 'update',
                email: emailValue,
                firstname: firstnameValue,
                lastname: lastnameValue,
                password: passwordValue,
                isAdmin: isAdminValue,
                isTeacher: isTeacherValue,
                changePassword: changePassword
            },
        },
        function(rtn) {
            try {
                let obj = JSON.parse(rtn);
                if (obj.success) {

                    // Ausgabe der Erfolgsmeldung
                    triggerResponseMsg('success', $('.successEditUser').html());

                    if (getCookie('UserLogin') == id) {
                        deleteCookie("UserLogin", "/")
                        location.reload();
                    }
                } else {

                    // Ausgabe der Fehlermeldung
                    if (obj.error == "update") {
                        triggerResponseMsg('error', $('.errorEditUser').html());
                    } else {
                        triggerResponseMsg('error', $('.errorDuplicate').html());
                    }
                    
                }
                
                // "Bearbeiten"-Fenster nach erfolgreicher ??bernahme der ??nderungen schlie??en und DataTable aktualisieren
                $("#editUserModal").modal("hide");
                reloadTable();
                
            } catch(e) {
                console.log(e);
                triggerResponseMsg('error', $('.errorEditUser').html());
            }
        }
    );
}

// Funktion zum L??schen eines existierenden Benutzers per Benutzer-ID (GR)
function deleteUser(id) 
{
    $.post(
        'src/php/_ajax/ajax.deleteUser.php',
        {
            data: {
                id: id    
            },
        },
        function(rtn) {
            try {
                let obj = JSON.parse(rtn);
                if (obj.success) {
                    // Ausgabe der Erfolgsmeldung
                    triggerResponseMsg('success', $('.successDeleteUser').html());
                } else {
                    // Ausgabe der Fehlermeldung, wenn Benutzer versucht, sich selbst zu l??schen
                    if (obj.status == "self_delete") {
                        triggerResponseMsg('error', $('.errorSelfDeleteUser').html());
                    } else {
                        triggerResponseMsg('error', $('.errorDeleteUser').html());
                    }    
                }

                // Nach erfolgreicher L??schung, das "L??schen"-Fenster schlie??en
                $("#deleteUserModal").modal("hide");
                reloadTable();
                
            } catch(e) {
                console.log(e);
                triggerResponseMsg('error', $('.errorDeleteUser').html());
            }
        }
    )
}

// Funktion zur Aktualisierung der DataTable (GR)
function reloadTable() {
    $('#tableOverlay').fadeIn(500);
    setTimeout(function() { 
        accountsTable.ajax.reload(hideOverlay());
    }, 150);    
}

function hideOverlay() {
    $('#tableOverlay').fadeOut(500);
}
