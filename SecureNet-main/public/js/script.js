var form_login = document.getElementById('login');
var form_signup = document.getElementById('signup');

$(".log-in").click(function () {
    $(".signIn").addClass("active-dx");
    $(".signUp").addClass("inactive-sx");
    $(".signUp").removeClass("active-sx");
    $(".signIn").removeClass("inactive-dx");
});

$(".back").click(function () {
    $(".signUp").addClass("active-sx");
    $(".signIn").addClass("inactive-dx");
    $(".signIn").removeClass("active-dx");
    $(".signUp").removeClass("inactive-sx");
});

salert = document.getElementById('successalert');
stext = document.getElementById('succ_span');
sname = document.getElementById('alert_uname');
simg = document.getElementById('userimg');

document.getElementById('successcloser').addEventListener('click', function (e) {
    $("#successalert").fadeOut(3000);
});

/**
 * @desc To Activate Page Transition
 */
function pg_trans(idd) {
    var layerClass = "." + idd + "-layer";
    var layers = document.querySelectorAll(layerClass);
    for (const layer of layers) {
        layer.classList.toggle("active");
    }
}

var outer_container = document.getElementById("outer-container");
var mytimer = document.getElementById("mytimer");
var pgtrans = document.getElementById("pg_trans");
var pgtransbot = document.getElementById("pg_trans_bot");
var myfoot = document.getElementById("my-foot");

/**
 * @desc After Successful Validation
 * @param user_name {String} User Name
 * @param olnw {String} Login/Signup
 */
function proceed_user(user_name, olnw) {
    pgtrans.style.visibility = 'visible';
    pgtrans.style.display = 'block';
    pgtransbot.style.visibility = 'hidden';
    if (olnw === 'login') {
        $('#userimg').attr("src", "img/cool.gif");
        stext.innerHTML = 'Welcome Back!';
        sname.innerHTML = user_name;
    } else if (olnw === 'signup') {
        $('#userimg').attr("src", "img/kiss.gif");
        stext.innerHTML = 'Hey New One!';
        sname.innerHTML = user_name;
    }
    salert.style.display = 'block';
    setTimeout(function () {
        $("#successalert").fadeOut(500);

        outer_container.style.background = "linear-gradient(45deg, #a770ef, #cf8bf3, #fdb99b)";
        //outer_container.style.backgroundSize = "400% 400%";
        //outer_container.style.animation = "gradient 2s infinite ease-in-out;"
        $('head').append('<link href="css/menu.css" media="all" rel="stylesheet">');
        myfoot.style.visibility = "block";
        $("#my-foot").fadeIn(500);
        fetch_banks();
    }, 2000);
    setTimeout(function () {
        //$('head').append('<link href="css/bground.css" media="all" rel="stylesheet">');
        $("#mymenu").fadeIn(500);
        pg_trans('top');
        pgtrans.style.visibility = 'hidden';
        pgtransbot.style.display = 'none';
        pgtrans.style.display = 'none';
        pgtransbot.style.visibility = 'hidden';

    }, 3000);

    $("#login-image").fadeOut(1000);
    $("#color-bg").fadeIn(1000);
    pg_trans('top');
}

function stop_user() {
    ualert.style.display = 'block';
    setTimeout(function () {
        $("#useralert").fadeOut(3000);
    }, 5000);
}

ualert = document.getElementById('useralert');
document.getElementById('alertcloser').addEventListener('click', function (e) {
    $("#useralert").fadeOut(3000);
});


/**
 * @desc Handle Login Form Submission
 */

$("#login").submit(function (e) {
    var log_name = document.getElementById('log-name').value;
    var log_pass = document.getElementById('log-pass').value;
    e.preventDefault();
    form_login.reset();
    $.ajax({
        url: 'http://localhost:6060/login',
        type: 'POST',
        data: {
            user: log_name,
            password: log_pass
        },
        success: function (msg) {
            console.log('User logged in', msg);
            if (msg) {
                proceed_user(log_name, 'login');
                //setTimeout(addlistener, 3000);
                console.log(msg);
            } else {
                stop_user();
            }
        }
    });
    return false;
});

/**
 * To get the Users from DB
 */

var my_json, my_users = [];
const remurl = 'http://localhost:6060/json';
const options = {method: 'GET'};
fetch(remurl, options)
    .then(async (res) => {
        //console.log(res);
        res = (await res.text());
        my_json = JSON.parse(res);
        console.log(my_json);
        return true
    })
    .then((res) => {
        for (var i = 0; i < my_json.length; i++) {
            var user = my_json[i];
            var user_name = user.user;
            my_users.push(user_name);
        }
        console.log('User list', my_users);
    })
    .catch((err) => console.error(err));

var newform = document.getElementById("updateUser");
var newmobile = document.getElementById("newMobile");
var newmail = document.getElementById("newMail");
var newaadhar = document.getElementById("newAadhar");

/**
 * @desc Handle Signup Form Submission
 */
$("#signup").submit(function (e) {
    var sign_name = document.getElementById('sign-name').value;
    var sign_pass = document.getElementById('sign-pass').value;
    var sign_repass = document.getElementById('sign-repass').value;
    //console.log(document.getElementById('sign-name').value);
    e.preventDefault();
    form_signup.reset();
    if (sign_pass === sign_repass) {
        //console.log(sign_name, sign_pass, sign_repass);
        proceed_user(sign_name, 'signup');
        $("#updateUser").submit(function (e) {
            e.preventDefault();
            var new_mobile = newmobile.value;
            var new_mail = newmail.value;
            var new_aadhar = newaadhar.value;
            var new_user = sign_name;
            var new_password = sign_pass;
            $.ajax({
                url: 'http://localhost:6060/signup',
                type: 'POST',
                data: {
                    user: new_user,
                    mobile: new_mobile,
                    mail: new_mail,
                    aadhar: new_aadhar,
                    password: new_password,
                    current: true,
                    verified: false,
                    mpin: ""
                },
                success: function (msg) {
                    console.log('User updated', msg);
                    $("#newClose").click();
                }
            });
            return false;
        });
        setTimeout(function () {
            $("#exModalbtn").click();
        }, 3000);

    }
    return false;
});

var signup_name = document.getElementById('sign-name')
var signup_pass = document.getElementById('sign-pass');
var signup_repass = document.getElementById('sign-repass');

/**
 * Event Listeners for Signup Page Elements
 */

signup_name.addEventListener('keyup', function (e) {
    $('#availusr').css("display", "initial");
    var tname = signup_name.value;
    if (my_users.includes(tname)) {
        console.log(tname, "Not Available");
        $('#availusr').attr("src", "img/red.png");
    } else {
        console.log("Available");
        $('#availusr').attr("src", "img/green.png");
    }
});

signup_pass.addEventListener('keyup', function (e) {
    $('#availpass').css("display", "initial");
    var tpass = signup_pass.value;
    if (tpass.length >= 4) {
        $('#availpass').attr("src", "img/green.png");
    } else {
        $('#availpass').attr("src", "img/red.png");
    }
});

signup_repass.addEventListener('keyup', function (e) {
    $('#availpass').css("display", "initial");
    $('#availrepass').css("display", "initial");
    var tpass = signup_pass.value;
    var trepass = signup_repass.value;
    //console.log(tpass, trepass);
    if (tpass === trepass) {
        $('#availrepass').attr("src", "img/green.png");
    } else {
        $('#availrepass').attr("src", "img/red.png");
    }
});


// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')

            }, false)
        })
})()

