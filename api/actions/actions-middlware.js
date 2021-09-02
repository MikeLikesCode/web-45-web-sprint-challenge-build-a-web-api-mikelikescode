const Actions = require('./actions-model');

function validateActionsId (req,res,next) {
    const { id } = req.params;
    Actions.get(id)
    .then(project => {
        if(project){
            req.project = project;
            next()
        }
        else{
            next({ status: 404, message: 'project not found'})
        }
    })
    .catch(next);
}

function validateAction (req,res,next){
    console.log(req.body);
    console.log(typeof req.body.completed);
    if(!req.body.project_id || !req.body.description || !req.body.notes){
        next({ status:400, message: "missing required field" })
    }
    else{
        next()
    }
}

module.exports = { validateActionsId, validateAction }
