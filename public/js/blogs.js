const token = localStorage.getItem('token');

window.addEventListener('DOMContentLoaded', async () => {
    try {
        await axios.get(`/authenticate-user`, {headers: {'auth': token}});

        // get all users posts with tags
        const res = await axios.get('/posts', {headers: {'auth': token}})
        showPostsOnScreen(res.data)
    } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 500)) {
            console.log(err.response.data.error);
            window.location.href = '/login'
        } else {
            console.log(err);
            alert('An error occurred.');
        }
    }
})

async function createPost(event) {
    try {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
    
        // Get selected tags
        const selectedTags = [];
        const checkboxes = document.getElementsByName('tags');
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedTags.push(checkbox.value);
            }
        });
    
        const postDetails = {
            title: title,
            content: content,
            tags: selectedTags
        };

        // Send the postData object to the server using Axios
        await axios.post('/posts', postDetails, {headers: {'auth': token}});

        alert('Post created successfully.');

        window.location.href = '/blogs'
    } catch (err) {
        if (err.response && err.response.status === 500) {
            alert(err.response.data.error);
        } else {
            console.log(err);
            alert('An error occurred.');
        }
    }
}

async function getPost(e) {
   try {
    e.preventDefault();
    const retrieveId = document.getElementById('retrieveId').value;
    const res = await axios.get(`/posts/${retrieveId}`, {headers: {'auth': token}})
    
    const post = res.data;
    showPostsOnScreen({posts: [post]})
   } catch (err) {
        if (err.response && (err.response.status === 403 || err.response.status === 404 || err.response.status === 500)) {
            alert(err.response.data.error);
        } else {
            console.log(err);
            alert('An error occurred.');
        }
   } 
}
function openModal(e) {
    e.preventDefault();
    var modal = document.getElementById('popupForm');

    // Get the <span> element that closes the modal
    var span = document.getElementById("closeForm");

    const updateId = document.getElementById('updateId').value;
    localStorage.setItem('updateId', updateId);
    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
            modal.style.display = "none";
    }

    // Close the modal if the user clicks outside of it
    window.onclick = function(event) {
            if (event.target == modal) {
              modal.style.display = "none";
            }
    }
}
async function updatePost(e) {
   try {
    e.preventDefault();
    const updateId = localStorage.getItem('updateId')
    
    const updateTitle = document.getElementById('updateTitle').value;
    const updateContent = document.getElementById('updateContent').value;

    // Get selected tags
    const updateSelectedTags = [];
    const updateCheckboxes = document.getElementsByName('updateTags');
    updateCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            updateSelectedTags.push(checkbox.value);
        }
    });
    
    const postDetails = {
        updateTitle: updateTitle,
        updateContent: updateContent,
        updateTags: updateSelectedTags
    };
    
    const res = await axios.put(`/posts/${updateId}`, postDetails, {headers: {'auth': token}})

    // Handle successful response
    console.log('Post updated successfully:', res.data);
    alert('Post updated successfully.');
    window.location.href = '/blogs'

   } catch (err) {
        if (err.response && (err.response.status === 403 || err.response.status === 404 || err.response.status === 500)) {
            alert(err.response.data.error);
        } else {
            console.log(err);
            alert('An error occurred.');
        }
   } 
}
async function deletePost(e) {
   try {
    e.preventDefault();
    const deleteId = document.getElementById('deleteId').value;
    const res = await axios.delete(`/posts/${deleteId}`, {headers: {'auth': token}})

    // Handle successful response
    console.log('Post deleted successfully:', res.data);
    alert('Post deleted successfully.');
    window.location.href = '/blogs'
   } catch (err) {
        if (err.response && (err.response.status === 403 || err.response.status === 404 || err.response.status === 500)) {
            alert(err.response.data.error);
        } else {
            console.log(err);
            alert('An error occurred.');
        }
   } 
}
function showPostsOnScreen(data){
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ""

    data.posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        
        postElement.innerHTML = `
            <div class="post-header">
                <img src="https://lexfingerprinting.com/development/wp-content/uploads/2022/11/tuktukdesign160600119.jpg" height="50px" width="50px" alt="User Avatar">
                <div class="post-user">
                    <span>${post.user.name}</span>
                    <span>${new Date(post.createdAt).toLocaleString()}</span>
                </div>
            </div>
            <div class="post-title">${post.title}</div>
            <div class="post-content">${post.content}</div>
            <div class="post-tags">Tags: ${post.tags.map(tag => tag.name).join(', ')}</div>
        `;

        postsContainer.appendChild(postElement);
    });
}