import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';

import './nfcReader.html';

Template.nfcReader.onCreated(function(){
  if(Meteor.isCordova) {
    this.nfcEnabled= new ReactiveVar(false);
    this.nfcValue= new ReactiveVar("ready");

    // Set interval to check if NFC is enabled
    this.intervalNfcCheck = Meteor.setInterval(()=> {
      nfc.enabled(() => {
        this.nfcEnabled.set(true);
      }, () => {
        this.nfcEnabled.set(false);
      });
    }, 1500);

    const onNfc = (nfcEvent) => {
      const tag = nfcEvent.tag;
      const nfcUid = nfc.bytesToHexString(tag.id);

      HTTP.get("https://demo1948542.mockable.io/01234567891234567", (error, result) => {
        if(error){
          console.log("error", error);
        }
        if(result){
          const { data } = result;
          console.log(nfcUid);
          console.log(data.uid);
          if( data.uid === nfcUid ) {
            this.nfcValue.set("true");
          } else {
            this.nfcValue.set("false");
          }
        }
      });
    }

    nfc.addNdefListener(
      onNfc,
      function() {},
      function() {}
    );
  }
});

Template.nfcReader.helpers({
  nfcEnabled: function(){
    return Template.instance().nfcEnabled.get();
  },
  nfcValue: function(){
    const nfcValue = Template.instance().nfcValue.get();
    return nfcValue;
  }
});

Template.nfcReader.onDestroyed(function(){
  // Stop interval to check if NFC is enabled
  Meteor.clearInterval(Template.instance().intervalNfcCheck);
});
