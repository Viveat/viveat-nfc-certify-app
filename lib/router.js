FlowRouter.route('/', {
    action: function(params) {
        BlazeLayout.render("layout", {main: "nfcReader"});
    }
});
FlowRouter.route('/nfc-reader', {
    action: function(params) {
        BlazeLayout.render("layout", {main: "nfcReader"});
    }
});
