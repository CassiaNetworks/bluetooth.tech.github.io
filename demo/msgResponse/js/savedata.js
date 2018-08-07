$("input").on('keyup',function(){
  //alert($(this).val())
  console.log($(this).val());
  mystorage.set($(this).attr('id'),$(this).val());
});

function loadData(){
  $("#rIP").val(mystorage.get("rIP") || "");
  $("#dMac").val(mystorage.get("dMac") || "");
  $("#option1").val(mystorage.get("option1") || "");
  $("#option2").val(mystorage.get("option2") || "");
  $("#msg").val(mystorage.get("msg") || "");
}

// function loadMode(){
//   let useway = mystorage.get('useway') || 'local' ;
//   $('#control').val(useway);
//   if (useway == 'local') {
//     $('#remote-crl').hide();
//     $('#local-crl').show();
//   }else{
//     $('#remote-crl').show();
//     $('#local-crl').hide();
//   }
// };
//   loadMode();
  loadData();
