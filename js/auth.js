// auth.js

/* setTimeout(()=>{
    document.getElementById('loading-label').innerHTML = 'loading..';
}, 300);
setTimeout(()=>{
    document.getElementById('loading-label').innerHTML = 'loading...';
}, 600);

setInterval(()=>{
    document.getElementById('loading-label').innerHTML = 'loading.';
    setTimeout(()=>{
        document.getElementById('loading-label').innerHTML = 'loading..';
    }, 300);
    setTimeout(()=>{
        document.getElementById('loading-label').innerHTML = 'loading...';
    }, 600);
},900); */

const backend_api_address = 'https://pokerjack.space';

window.Telegram.WebApp.disableVerticalSwipes();

async function login() {
    try {
        const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
        if (!tgUser) {
            throw new Error("No user data available from Telegram WebApp");
        }
        
        const response = await fetch(`${backend_api_address}/is_user_authorised?user_id=${tgUser.id}`);
        const data = await response.json();
        
        if (data.isUserAuthorised) {

            alert('user found');
            isStartAnim = false;
                console.log(previewC1);
                gsap.to(previewC1.scale, {x: 0,y : -.04, z: .0, duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC2.scale, {x: 0,y : -.02, z: .0, duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC3.scale, {x: 0, y: -0.02, z: 0, duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC4.scale, {x: 0, y: -.02, z: -.0, duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC5.scale, {x: 0, y : -.04, z: -.0, duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });

                gsap.to(pokerTableModel.scale, {x: 0.044,y : 0.044, z: 0.044, duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                gsap.to(document.getElementById('hello-container'), {y: 100 + 'vh', duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                gsap.to(document.getElementById('footer-menu'), {x: 0 + 'px', duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                gsap.to(document.getElementById('games-container'), {x: 0 + 'px', duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                document.getElementById('loading-label').style.display = 'none';
        } else {
            alert('user not found');
            //alert(data);
            document.getElementById('loading-label').style.display = 'none';
            const authorizer = document.getElementById('hello-container');
            //authorizer.style.display = '';
            
            //const authorizeButton = document.createElement('button');
            //authorizeButton.innerText = 'Authorize';
            const authorizeButton = document.getElementById('connect-btn');
            authorizeButton.addEventListener('click', async () => {
                await authorizeUser(tgUser);
            });

            //authorizer.appendChild(authorizeButton);
        }
    } catch (error) {
        alert(error);
        console.error('Error loading user authorization status:', error);
    }
}

async function authorizeUser(user) {
    try {
        const response = await fetch(`${backend_api_address}/authorise_user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const data = await response.json();

        if (data.success) {
            alert('user connected');
            //document.getElementById('hello-container').style.display = 'none';
            isStartAnim = false;

                gsap.to(previewC1.scale, {x: 0,y : -.04, z: .0, duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC2.scale, {x: 0,y : -.02, z: .0, duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC3.scale, {x: 0, y: -0.02, z: 0, duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC4.scale, {x: 0, y: -.02, z: -.0, duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC5.scale, {x: 0, y : -.04, z: -.0, duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });


                gsap.to(pokerTableModel.scale, {x: 0.044,y : 0.044, z: 0.044, duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                gsap.to(document.getElementById('hello-container'), {y: 100 + 'vh', duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                gsap.to(document.getElementById('footer-menu'), {x: 0 + 'px', duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                gsap.to(document.getElementById('games-container'), {x: 0 + 'px', duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
            document.getElementById('loading-label').style.display = 'none';
        } else {
            alert('user not connected');
            alert(data);
        }
    } catch (error) {
        console.error('Error authorizing user:', error);
        alert(error);
    }
    //alert(data);
}


