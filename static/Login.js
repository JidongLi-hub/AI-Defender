//进行4位随机验证码的生成
function verification_code (e) {
    //其为生成验证码的元素
    var t = "ABCDEFGHIJKMLNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789"
    var a = t.length;
    var n = "";
    for (var i = 0; i < e; i++) {
        n += t.charAt(Math.floor(Math.random()*a));
    }
    return n;
}

//进行相应验证码的展示
var verification_code_four = verification_code(4);
window.onload = function(){
    document.getElementById('verification_code').innerHTML = verification_code_four;
}

//Login的绑定函数
function get_input () {
    location.href = '/index';
    // var account_input = document.getElementById('input_account').value;
    // if(account_input == "") window.alert('输入帐号不可为空');
    // var password_input = document.getElementById('input_pass').value;
    // if(password_input == "") window.alert('输入密码不可为空');
    // var verification_code_input = document.getElementById('verification_code_input').value;
    // if(verification_code_input != verification_code_four) window.alert('验证码输入不正确,请重新输入');
    // //手动进行post表单的发送
    // if(account_input != "" && password_input != "" && verification_code_input == verification_code_four){
    //     //document.getElementById('send_message').submit();
    //     var xhttp = new XMLHttpRequest();
    //     xhttp.onreadystatechange = function () {
    //         if(this.readyState == 4 && this.status == 200) {
    //             console.log(this);
    //             console.log(this.responseText);
    //             if(this.responseText.length <= 15) {
    //                 window.alert("This account is not registered！");
    //                 location.href = 'Login.html';
    //             }
    //             else if(this.responseText == 'Login result:Fail to login,your password is wrong!'){
    //                 window.alert(this.responseText);
    //                 location.href = 'Login.html';
    //             }
    //             else {
    //                 window.sessionStorage.setItem("account",account_input);
    //                 location.href = '../AIDefender/AIDefender.html';
    //             }
    //         }
    //     };
    //     xhttp.open("POST","/server/Login.php",true);
    //     var send_message = "account=" + account_input + "&password=" +password_input;
    //     xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    //     xhttp.send(send_message);
    //
    // }
}