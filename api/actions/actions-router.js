const express = require('express');
const router = express.Router();
const { validateActionsId, validateAction } = require('./actions-middlware')
const Actions = require('./actions-model')

router.get('/', (req,res) => {
    Actions.get()
    .then(actions => {
        if(actions){
            res.status(200).json(actions)
        }
        else{
            res.status(200).json([])
        }
    })
})

router.get("/:id", validateActionsId, (req,res,next) => {
    Actions.get(req.params.id)
    .then(action => {
        res.status(200).json(action);
    })
    .catch(next)
})

router.post('/', validateAction, (req,res,next) => {
    Actions.insert(req.body)
    .then(action => {
        res.status(200).json(action)
    })
    .catch(next)
})

router.put('/:id', validateActionsId, validateAction, (req,res,next) => {
    Actions.update(req.params.id, req.body)
    .then(action => {
        res.json(req.body)
    })
    .catch(next)
})

router.delete('/:id', validateActionsId, async(req,res,next) => {
    try{
        const action = await Actions.get(req.params.id);
        await Actions.remove(req.params.id);
        res.status(200).json(action)
    }
    catch(err){
        next(err)
    }
})

// eslint-disable-next-line
router.use((err, req, res, next) => {
    console.log(err.message);
    res.status(err.status || 500).json({
      message: err.message,
      customMessage: "Something bad inside the projects router!",
    });
  });



module.exports = router