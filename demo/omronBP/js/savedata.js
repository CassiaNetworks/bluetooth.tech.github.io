$("input").on('keyup',function(){
  //alert($(this).val())
  console.log($(this).val());
  mystorage.set($(this).attr('id'),$(this).val());
});

function loadData(){
  $("#ip").val(mystorage.get("ip") || "");
  $("#acAddress").val(mystorage.get("acAddress") || "");
  $("#ap-mac").val(mystorage.get("ap-mac") || "");
  $("#password").val(mystorage.get("password") || "");
  $("#username").val(mystorage.get("username") || "");
  $("#pairCode").val(mystorage.get("pairCode") || "");
  $("#pairCode-ac").val(mystorage.get("pairCode-ac") || "");
  $("#devices").val(mystorage.get("devices") || "");
}

function loadMode(){
  let useway = mystorage.get('useway') || 'local' ;
  $('#control').val(useway);
  if (useway == 'local') {
    $('#remote-crl').hide();
    $('#local-crl').show();
  }else{
    $('#remote-crl').show();
    $('#local-crl').hide();
  }
};
  loadMode();
  loadData();
