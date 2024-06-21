const express = require('express');
const postController = require('../controllers/post');
const userAuthentication = require('../middlewares/auth');

const router = express.Router();

router.get('/posts', userAuthentication.auth, postController.getPosts);
router.get('/posts/:retrieveId', userAuthentication.auth, postController.getPost);
router.put('/posts/:updateId', userAuthentication.auth, postController.updatePost);
router.delete('/posts/:deleteId', userAuthentication.auth, postController.deletePost);
router.post('/posts', userAuthentication.auth, postController.createPost);

module.exports = router;