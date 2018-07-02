   $("input").on('keyup',function(){
    //alert($(this).val())
        mystorage.set($(this).attr('id'),$(this).val());
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
        $("#ap-ip").val(mystorage.get("ap-ip") || "");
        $("#ap-mac").val(mystorage.get("ap-mac") || "");
        $("#password").val(mystorage.get("password") || "");
        $("#username").val(mystorage.get("username") || "");
    }
    loadData();
