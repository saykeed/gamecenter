
<template>
    <other-pages>
        <div class="landingpage py-24 px-8 h-auto lg:flex flex-row-reverse items-start justify-between overflow-hidden">
            <div class="animes h-[400px] relative flex items-center justify-center w-full  max-w-[500px] mx-auto lg:mx-0">
                <div class="circle w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] lg:w-[300px] lg:h-[300px] rounded-full mx-auto"></div>
                <img src="../assets/img/boy.png" class="boy absolute w-64 -bottom-0 -left-10 sm:w-[300px]" alt=""/>
                <img src="../assets/img/object1.png" class="object_one absolute w-28 -top-0 left-0 sm:left-[35%] -translate-x-1/2 sm:w-[130px]"  alt=""/>
                <img src="../assets/img/object2.png" class="object-two absolute w-28 -bottom-0 right-0 sm:left-[35%] -translate-x-1/2 sm:w-[130px]" alt=""/>
                <img src="../assets/img/girl.png" class="girl absolute w-64 -top-10 -right-10 sm:w-[300px]" alt=""/>
            </div>
            <div class="intro-texts mt-10 lg:mt-0 max-w-[500px]">
                <h1 class="text-6xl font-black mb-4 py-2 gradient">Have Fun With Friends Gaming</h1>
                <p class="text-white text-md ">Game Center is a platform focused on connecting people using games on the web. Create a 1v1 or tournament challenge and invite your friends. <br/>Voice Chat and Video Call also availabe...</p>
                <router-link to="/games" class="a-btn-white mt-3">Get Started for Free</router-link>
            </div>
        </div>
    </other-pages>
</template>

<script setup lang="ts">

</script>

<style scoped>

    
    img.boy, img.object-two{
        animation: below 4s infinite;
    }
    @keyframes below {
        0%{transform: translateY(0px);}
        50%{transform: translateY(30px)}
        100%{transform: translateY(0)}
    }

    img.girl, img.object_one{
        animation: top 4s infinite;
    }
    @keyframes top {
        0%{transform: translateY(0px)}
        50%{transform: translateY(-30px)}
        100%{transform: translateY(0)}
    }

    .gradient {
        font-size: 67px;
        background: -webkit-linear-gradient(245.29deg, #6DC1DC 13.32%, #A690FC 28.55%, #FC96BB 55.55%, #FFC397 84.12%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: hue 1.5s infinite linear;
    }

    .circle{
        background: -webkit-linear-gradient(245.29deg, #6DC1DC 13.32%, #A690FC 28.55%, #FC96BB 55.55%, #FFC397 84.12%);
    }

    @keyframes hue {
        from {
            -webkit-filter: hue-rotate(0deg);
        }
        to {
            -webkit-filter: hue-rotate(360deg);
        }
    }
</style>
