const Projects = require('./projects-model');

function validateProjectId (req,res,next) {
    const { id } = req.params;
    Projects.get(id)
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

function validateProject (req,res,next){
    console.log(req.body);
    console.log(typeof req.body.completed);
    if(!req.body.name || !req.body.description || typeof req.body.completed !== 'boolean'){
        next({ status:400, message: "missing required field" })
    }
    else{
        next()
    }
}

module.exports = { validateProjectId, validateProject }
