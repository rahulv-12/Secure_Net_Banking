var uparrow = document.getElementById('degree--up-0');
var downarrow = document.getElementById('degree--down-0');
var menulist = document.getElementById("menu__listings");
var menutoggle = document.getElementById("menu__toggle");

var clickcnt = 0;
uparrow.addEventListener('click', function (e) {
    clickcnt += 1;
    switch (clickcnt) {
        case 1:
            menulist.style.transform = 'rotate(116deg) scale(0.95)';
            break;
        case 2:
            menulist.style.transform = 'rotate(224deg) scale(0.95)';
            break;
        case 3:
            menulist.style.transform = 'rotate(10deg) scale(0.95)';
            clickcnt = 0;
            break;
    }
});

downarrow.addEventListener('click', function (e) {
    switch (clickcnt) {
        case 0:
            menulist.style.transform = 'rotate(224deg) scale(0.95)';
            clickcnt = 3;
            break;
        case 2:
            menulist.style.transform = 'rotate(116deg) scale(0.95)';
            break;
        case 1:
            menulist.style.transform = 'rotate(10deg) scale(0.95)';
            break;
    }
    clickcnt -= 1;
});

m_up_arr = document.getElementById("m_arr_up");
m_down_arr = document.getElementById("m_arr_down");
var toggle = false;

menutoggle.addEventListener('click', function (e) {
    if (!toggle) {
        toggle = true;
        menulist.style.transform = 'rotate(10deg) scale(0.95)';
        m_up_arr.style.display = 'block';
        m_down_arr.style.display = 'block';
    } else {
        toggle = false;
        menulist.style.transform = 'rotate(10deg) scale(0.0)';
        m_up_arr.style.display = 'none';
        m_down_arr.style.display = 'none';
    }
});

function logout_user(user_name) {
    $("#menu__toggle").trigger('click');
    pgtransbot.style.visibility = 'visible';
    pgtrans.style.visibility = 'hidden';
    pgtransbot.style.display = 'block';
    stext.innerHTML = 'See You Soon!';
    sname.innerHTML = user_name;
    salert.style.display = 'block';
    setTimeout(function () {
        $("#successalert").fadeOut(500);

        outer_container.style.backgroundSize = "100%";
        outer_container.style.animation = "gradient 2s infinite ease-in-out;"

    }, 3000);
    outer_container.style.background = "radial-gradient(circle, rgba(36, 36, 110, 0.751), rgba(28, 113, 175, 0.751))";
    setTimeout(function () {
        pgtrans.style.visibility = 'hidden';
        pgtrans.style.display = 'none';
        pgtransbot.style.display = 'none';
        pgtransbot.style.visibility = 'hidden';
        pg_trans('bottom');
    }, 3000);
    $("#mymenu").fadeOut(500);
    $('link[rel=stylesheet][href*="css/menu.css"]').remove();
    $('#availusr').css("display", "none");
    $('#availpass').css("display", "none");
    $('#availrepass').css("display", "none");
    $(".log-in").trigger('click');
    $("#login-image").fadeIn(1000);
    $("#color-bg").fadeOut(1000);
    $("#my-foot").fadeOut(500);
    $("#mybanks").fadeOut(500);
    pg_trans('bottom');

}


logoutbtn = document.getElementById("logout_btn");
logoutbtn.addEventListener('click', function (e) {
    e.preventDefault();
    //logout_user("hi");
    $.ajax({
        url: 'http://localhost:6060/logout',
        type: 'GET',
        success: function (msg) {
            //console.log('User logged out', msg);
            logout_user(msg)
        }
    });
});

userbtn = document.getElementById("user-btn");

userlabel = document.getElementById("userModalLabel");
usermobile = document.getElementById("userMobile");
usermail = document.getElementById("userMail");
useraadhar = document.getElementById("userAadhar");
userverify = document.getElementById("usrverify");
verifybtn = document.getElementById("userVerify");
mpinbtn = document.getElementById("userMpin");

var curVid = "";
var curMobile = "";
verifybtn.addEventListener('click', e => {
    console.log('verifybtn');
    e.preventDefault();

    $.ajax({
        url: 'http://localhost:6060/verifyuser',
        type: 'GET',
        success: function (msg) {
            if (msg.status === 'pending') {
                curMobile = msg.mobile;
                curVid = msg.vid;
                $("#userClose").click();
                $("#mobileModalbtn").click();
            }
        }
    });
    $("#usrModalbtn").click();
});

var mybank = document.getElementById("mybanks");
var bname = document.getElementById("runt_nameH");
var acc = document.getElementById("runt_descH");
var cus = document.getElementById("runt_timeH");
var bimg = document.getElementById("stop-btn");

function fetch_banks() {
    var banks = ['SBI', 'KVB', 'HDFC', 'AXIS', 'CUB', 'ICICI'];
    var accno = Math.floor(Math.random() * 10000000000);
    var bno = Math.floor((Math.random() * 6) + 1);
    var cno = Math.floor(Math.random() * 10000000);
    accno = banks[bno] + String(accno);
    bname.innerHTML = banks[bno];
    acc.innerHTML = accno;
    cus.innerHTML = "C.ID : " + String(cno);
    var src = "";
    switch (bno) {
        case 0:
            src = "https://www.freepnglogos.com/uploads/sbi-logo-png/why-sbi-billion-loan-adani-doesn-make-sense-5.png";
            break;
        case 1:
            src = "img/kvb.jpg";
            break;
        case 2:
            src = "img/hdfc.png";
            break;
        case 3:
            src = "img/axis.png";
            break;
        case 4:
            src = "img/cub.png";
            break;
        case 5:
            src = "img/icicici.jpg";
            break;
    }
    bimg.src = src;
    if (curVerified === true) {
        mybank.style.display = "block";
    } else {
        mybank.style.display = "none";
    }
}

var curVerified = false;
userbtn.addEventListener('click', e => {
    console.log('usrbtn');
    $.ajax({
        url: 'http://localhost:6060/currentuser',
        type: 'GET',
        success: function (msg) {
            var mydata = msg[0];
            userlabel.innerText = "Hey " + mydata['user'];
            usermobile.value = mydata['mobile'];
            usermail.value = mydata['mail'];
            useraadhar.value = mydata['aadhar'];

            if (mydata['verified'] === "true") {
                userverify.src = "img/green.png";
                verifybtn.style.display = "none";
                curVerified = true;
                fetch_banks();
            } else {
                userverify.src = "img/red.png";
                verifybtn.style.display = "block";
            }

            if (mPinch || mydata['mpin'].length >= 4 || mydata['mpin']) {
                mpinbtn.style.display = "none";
            } else {
                mpinbtn.style.display = "block";
            }
        }
    });
    $("#usrModalbtn").click();
});

var usermpin = document.getElementById("userMpin");

usermpin.addEventListener('click', e => {
    e.preventDefault();
    $("#userClose").click();
    $("#mpinModalbtn").click();

});

var mpinModal = document.getElementById('mpinModal')
mpinModal.addEventListener('hidden.bs.modal', function (event) {
    console.log("closed");
    $("#usrModalbtn").click();
});

var mpinform = document.getElementById("mpinForm");
var mpinrr = document.getElementById("mpinerror");
var mPinch = false;
$("#mpinForm").submit(function (e) {
    var mpin = document.getElementById('typempin').value;
    var rempin = document.getElementById('retypempin').value;
    e.preventDefault();
    if (mpin === rempin) {
        $.ajax({
            url: 'http://localhost:6060/mpin',
            type: 'POST',
            data: {
                pin: mpin,
            },
            success: function (msg) {
                console.log('User Mpin', msg);
                if (msg) {
                    mpinform.reset();
                    mpinbtn.style.display = 'none';
                    mPinch = true;
                    $("#mpinClose").click();
                } else {
                    mPinch = false;
                }
            }
        });
        mpinrr.innerHTML = "";
    } else {
        console.log("Error");
        mpinrr.innerHTML = "Check MPIN!";
    }
    return false;
});

var mobileform = document.getElementById("mobileForm");
var otperror = document.getElementById("otperror");
mobileform.onsubmit = function (e) {
    var otp = document.getElementById("mobileOtp").value;
    e.preventDefault();
    $.ajax({
        url: 'http://localhost:6060/otp',
        type: 'POST',
        data: {
            otp: otp,
            vid: curVid,
            mobile: curMobile
        },
        success: function (msg) {
            console.log('User OTP', msg);
            if (msg === 'approved') {
                mobileform.reset();
                $("#mobileClose").click();
                userverify.src = "img/green.png";
                verifybtn.style.display = "none";
            } else {
                otperror.innerHTML = "Check OTP!";
                setTimeout(function () {
                    otperror.innerHTML = "";
                }, 2000)
            }
        }
    });
}

var otpModal = document.getElementById('mobileModal')
otpModal.addEventListener('hidden.bs.modal', function (event) {
    console.log("closed");
    $("#usrModalbtn").click();
});
