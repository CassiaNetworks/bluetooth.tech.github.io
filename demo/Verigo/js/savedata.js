   $(".txt").on('keyup',function(){
    //alert($(this).val())
    mystorage.set($(this).attr('id'),$(this).val());
    console.log($(this).attr('id'),$(this).val());
    })

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
        $("#acaddress").val(mystorage.get("acaddress") || "");
        $("#username").val(mystorage.get("username") || "");
        $("#password").val(mystorage.get("password") || "");
        $("#apmac").val(mystorage.get("apmac") || "");
        //$("#node").val(mystorage.get("node") || "");
        //nodeArr = $("#node").val().split(',') || [$("#node").val()];
        //console.log(nodeArr);

    }
    loadData();
