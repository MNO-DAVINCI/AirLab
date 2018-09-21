  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
    }
  });

function Model ()
{
    var base_url = window.location.origin;
    var self = this
    self.files = ko.observableArray()
    self.loginButton = ko.observable()
    self.loginInfo = ko.observableArray([
        {name:"email"},
        {name:"password"}
    ])
    self.registerInfo = ko.observableArray([
        {name:"email"},
        {name:"name"},
        {name:"password"}   
    ])
    self.forgetInfo = ko.observableArray([
        {name:"email"}
    ])
    self.token = ko.observable()
    self.currentPageData = ko.observableArray()
    self.currentPage = ko.observable()
    self.pages = ko.observableArray()
    self.meters = ko.observableArray()
    self.devices = ko.observableArray()
    self.user = ko.observableArray()
    self.userDevice = ko.observableArray()
    self.deviceMeter = ko.observableArray()

    /**
    *
    *  canvas coordinates
    */
    var canvas = document.getElementById('background')
    var context = canvas.getContext('2d')
    $('#background').click(function(event)
    {
        let xy = getMousePos(canvas,event)
        console.log(getMousePos(canvas,event))
        
        context.fillStyle = "#FF0000";  
        context.fillRect(xy['x'],xy['y'],10,10)
    })
    function getMousePos(canvas, event) {
        var rect = canvas.getBoundingClientRect()-
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
            }
    }
    /**
    *
    *   upload image
    */
        self.fileSelect= function (element,event) {
        var files =  event.target.files;// FileList object
        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

          // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }          

            var reader = new FileReader();

              // Closure to capture the file information.
            reader.onload = (function() {
                return function(event){
                    var img = new Image();
                    img.addEventListener("load", function() {
                    context.drawImage(img, 0, 0);
                    });
                    img.src = event.target.result;
                }                        
            })(f);
              // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    };

    /**
     * [loginToken description]
     * @return {[type]} [description]
     */
    self.loginToken = function() {
        if (self.loginButton() == "Sign in") {
            $.post(base_url + '/api/login',{email:$('#email').val(), password:$('#password').val()}).done(function(data)
            {

                self.token(data['access_token'])
                console.log(self.token())

                $.post(base_url + '/api/uhoo/last-meter',{token:self.token()}).done(function(data)
                {
                    self.meters(data)
                    $("#container").removeClass("d-none")
                    $("#loginCont").addClass("d-none")
                })
                $.post(base_url + '/api/uhoo/devices', {token:self.token()}).done(function(data)
                {
                    self.devices(data)
                    $("#container").removeClass("d-none")
                    $("#loginCont").addClass("d-none")
                    console.log(self.devices())
                })            
            })
        } else if (self.loginButton() == "Sign up") {
            $.post(base_url + '/api/create',{email:$('#email').val(), password:$('#password').val(), name:$('#name').val()}).done(function(data)
            {
                console.log(data)
                self.loginButton("Sign in")
                self.loginToken()
            })
        } else {
            //forget password comes here
        }
        
    }

    /**
     * [getMeters description]
     * @return {[type]} [description]
     */
    self.getMeters = function(){
        $.post(base_url + '/api/uhoo/meters', {token: self.token()}).done(function(data){
            self.deviceMeter(data)
            console.log(self.deviceMeter())
        })
    }

    /**
     * [getDevices description]
     * @return {[type]} [description]
     */
    self.getDevices = function(){
        $.post(base_url + '/api/uhoo/user/device', {token: self.token()}).done(function(data){
            self.userDevice(data)
            console.log(self.userDevice())
        })
    }

    /**
     * [profile description]
     * @return {[type]} [description]
     */
    self.profile = function(){
        $.post(base_url + '/api/me', {token:self.token()}).done(function(data){
            self.user(data)
            console.log(self.user())
        })
    }

    /**
     * [choosePage description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    self.choosePage = function(data)
    {
        data = data.toLowerCase()
        self.currentPage(data)
        console.log(self.currentPage())

        if (data == "login") {
            self.loginButton('Sign in')
            self.currentPageData(self.loginInfo())
            self.pages([{name: 'Register'}, {name: 'Forgot password'}])

        }else if (data == "register"){
            self.loginButton('Sign up')
            self.currentPageData(self.registerInfo())
            self.pages([{name: 'Login'}, {name: 'Forgot password'}])

        }else{
            self.loginButton('Send email')
            self.currentPageData(self.forgetInfo())
            self.pages([{name: 'Register'}, {name: 'Login'}])

        }
        console.log(self.currentPageData())
    }
    self.choosePage('login')

    /**
     * [logout description]
     * @return {[type]} [description]
     */
    self.logout = function(){
        $.post(base_url + '/api/logout', {token:self.token()}).done(function(data)
        {
            $("#container").addClass("d-none")
            $("#loginCont").removeClass("d-none")
            $('#email').val("")
            $('#password').val("")
            self.meters("")
            self.devices("")

            console.log(data)
        })
    }
}

ko.applyBindings(new Model())
