<script>
    import linkedinSVG from '../assets/linkedin-svgrepo-com.svg';
    import githubSVG from '../assets/github-svgrepo-com.svg';
    export let firstName;
    export let lastName;
    export let linkedin;
    export let image;
    export let github;
  </script>

  <li class="contributor-card">
    <img src={image} alt="" class="contributorPic" />
    <p class="name">
      {firstName} <br />{lastName}
    </p>
    <div class="social-links">
      <a target="_blank" href={`https://www.linkedin.com/in/${linkedin}`}>
        <img src={linkedinSVG} alt="LinkedIn Icon" />
      </a>
      <a target="_blank" href={`https://github.com/${github}`}>
        <img src={githubSVG} alt="GitHub Icon" />
      </a>
    </div>
  </li>
  
  <style>
    .name {
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      font-size: 1.5rem;
      line-height: 1.5rem;
      font-size: 1rem;
      font-weight:300;
      color: #fff;
    }

    .social-links {
      display: flex;
      gap: 0.75rem;
      margin-left: 0.75rem;
    }

    .contributorPic {
        height: 7rem;
        border-radius: 9999px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.212);
    }

    .contributor-card {
        background: linear-gradient(150deg, #ffffff47, #f5dede70, rgba(254, 123, 145, 0.32));;
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(7.9px);
        -webkit-backdrop-filter: blur(7.9px);
        border: 1px solid rgba(255, 255, 255, 0.18);
        padding-top: 1.5rem;
        -webkit-filter: grayscale(25%);
        filter: grayscale(25%);
    }

    .contributor-card:hover {
        background: linear-gradient(150deg, #ffffff61, #f5dede86, rgba(249, 136, 155, 0.472));
        -webkit-filter: none; 
        filter: none;
    }
  </style>
  