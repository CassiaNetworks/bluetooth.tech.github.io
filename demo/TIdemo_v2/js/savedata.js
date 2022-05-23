   $(".txt").on('keyup',function(){
    //alert($(this).val())
    mystorage.set($(this).attr('id'),$(this).val());
    console.log($(this).attr('id'),$(this).val());
    });

    function loadData(){
        $("#acaddress").val(mystorage.get("acaddress") || "");
        $("#username").val(mystorage.get("username") || "");
        $("#password").val(mystorage.get("password") || "");
        $("#apmac").val(mystorage.get("apmac") || "");
        $("#ap-ip").val(mystorage.get("ap-ip") || "");

        //$("#node").val(mystorage.get("node") || "");
        //nodeArr = $("#node").val().split(',') || [$("#node").val()];
        //console.log(nodeArr);

    }

    function loadMode(){
       let useway = mystorage.get('useway') || 'local' ;
       $('#local-control').val(useway);
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
