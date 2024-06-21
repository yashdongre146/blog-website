const Post = require("../models/post");
const Tag = require("../models/tag");
const User = require("../models/user");

exports.createPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, content, tags } = req.body;

        const post = await Post.create({
            title: title,
            content: content,
            userId: userId
        });
        
        const tagPromises = tags.map(tagName => Tag.findOrCreate({
            where: { name: tagName } // Find or create tag by name
        }));
        
        const tagResults = await Promise.all(tagPromises);
        
        const tagObjects = tagResults.map(result => result[0]);
        
        await post.addTags(tagObjects);
        
        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post. Please try again later.' });
    }
}
exports.getPosts = async (req, res) => {
    try {
        // Fetch all posts along with their associated tags and user
        const posts = await Post.findAll({
            include: [
                {
                    model: Tag,
                    attributes: ['id', 'name'], // Include tag details
                    through: { attributes: [] } // Exclude PostTag join table attributes
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'email'] // Include user details
                }
            ],
            order: [['createdAt', 'DESC']] // sort by creation date
        });

        res.status(200).json({ posts: posts });
    } catch (error) {
        console.error('Error getting posts:', error);
        res.status(500).json({ error: 'Failed to get posts. Please try again later.' });
    }
};
exports.getPost = async (req, res) => {
    try {
        const {retrieveId} = req.params;
        const userId = req.user.id;

        const post = await Post.findByPk(retrieveId, {
            include: [
                {
                    model: Tag,
                    attributes: ['id', 'name'], // Include tag details
                    through: { attributes: [] } // Exclude PostTag join table attributes
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'email'] // Include user details
                }
            ]
        });
        
        // Check if the post exists
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        // Check if the user is authorized to update the post
        if (post.userId !== userId) {
            return res.status(403).json({ error: 'You are not authorized to update this post.' });
        }

        // Send the post and associated tags
        res.status(200).json(post);
    } catch (error) {
        console.error('Error getting post:', error);
        res.status(500).json({ error: 'Failed to get post. Please try again later.' });
    }
};
exports.updatePost = async (req, res) => {
    try {
        const {updateId} = req.params;
        const userId = req.user.id;
        const { updateTitle, updateContent, updateTags } = req.body;

        // Find the post by id
        const post = await Post.findByPk(updateId);

        // If post not found, return 404
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }
        
        // Check if the user is authorized to update the post
        if (post.userId !== userId) {
            return res.status(403).json({ error: 'You are not authorized to update this post.' });
        }
        
        // Update the post attributes
        await post.update({ title: updateTitle, content: updateContent });
        
        // Array to hold new tag instances
        const newTags = [];

        // Loop through provided tags and find or create them
        for (let tagName of updateTags) {
            let [tag] = await Tag.findOrCreate({ where: { name: tagName } });
            newTags.push(tag);
        }
        
        // Set new tags for the post
        await post.setTags(newTags);

        res.status(200).json({ message: 'Post and associated tags successfully updated.' });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Failed to update post. Please try again later.' });
    }
};
exports.deletePost = async (req, res) => {
    try {
        const {deleteId} = req.params;
        const userId = req.user.id;

        // Find the post by id
        const post = await Post.findByPk(deleteId);

        // If post not found, return 404
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        // Check if the user is authorized to update the post
        if (post.userId !== userId) {
            return res.status(403).json({ error: 'You are not authorized to update this post.' });
        }
        
        // Get associated tags
        const tags = await post.getTags();
        
        // Remove associations in the join table
        if (tags && tags.length > 0) {
            await post.removeTags(tags);
        }
        
        // Delete the post
        await post.destroy();
        
        res.status(200).json({ message: 'Post and associated tags successfully deleted' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post. Please try again later.' });
    }
};