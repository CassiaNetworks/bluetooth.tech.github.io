const dashBoardItemModel = Backbone.Model.extend({
    defaults: {
        userName: '',
        totalStep: '',
        cal: '',
        heartRate: '',
        node: '',
        step: '',
        say:true
    },
    idAttribute:'node',
    initialize:function(){
        this.set('cid',this.cid)
    }
})

const DashBoardItemColl = Backbone.Collection.extend({
    model:dashBoardItemModel,
    initialize:function(){
    }
});


const dashBoardItemColl = new DashBoardItemColl()
export {dashBoardItemColl}
