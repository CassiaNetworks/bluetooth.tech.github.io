   $("input").on('keyup',function(){
    //alert($(this).val())
    mystorage.set($(this).attr('id'),$(this).val().trim());
    console.log($(this).attr('id'),$(this).val().trim());
    });

   /*$("#node").on('keyup',function(){
        let node = $(this).val();
        if(node.indexOf(",") != -1){
            mystorage.set($(this).attr('id'),node.split(","));
            nodeArr = node.split(',');
            
        }else{
            mystorage.set($(this).attr('id'),[node]);
            nodeArr = [node] || [];
        }
        console.log("node",nodeArr);
   })*/

    function loadData(){
        $("#acAddress").val(mystorage.get("acAddress") || "");
        $("#username").val(mystorage.get("username") || "");
        $("#password").val(mystorage.get("password") || "");
        $("#apmac").val(mystorage.get("apmac") || "");
        $("#devMac").val(mystorage.get("devMac") || "");
        //$("#node").val(mystorage.get("node") || "");
        //nodeArr = $("#node").val().split(',') || [$("#node").val()];
        //console.log(nodeArr);

    }
    loadData();
