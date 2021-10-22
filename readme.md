# A Simple HTML/CSS/JS Presentation Framework

This repo contains a simple framework you can use to create 2D presentations. This project was born from a desire to include 
live HTML, CSS, and JS demos right in the presentation.

## 2D Presentations

Each 'slide' takes up a single unit on a grid, and new slides can be placed above, below, or to the sides of others.
Slides transition with a smooth-scrolling animation to trace the path between them.

## Controls

Arrow keys move the viewport a single slide. 1-9 will take you to the first slide of the given row. Tab-presses are handled separately
and should always take you to the correct view for the given slide.

## Assembly *is* Required

I built this framework with a specific presentation in mind, so it may not fit your needs exactly out of the box. Below are some tips 
to get you started and point you in the right direction if you're looking to change some things.

- Slides must be added manually using the template included in the index.html file (the blank slide in the second row).
    - To create a new row:
      ```HTML
      <div class='row'> 
        <!--Slides go here-->
      </div>
      ```
- To get the arrows to work correctly with the buttons, you will need to include a link to your own Font Awesome kit in the `<head>`.
- The basic color scheme and typography styles can be adjusted in the base.css file, which also includes some other, possibly useful variables.

*Please let me know if you run into any issues when using this framework, and I'll be happy to add more tips.*

## Demos

You can find a presentation I made (with some company-specific information removed) in 
the [EX_My_Presentation Branch](https://github.com/ZachJDev/Simple-Presentation/tree/EX_My_Presentation). 
I hope to add a few screenshots to give you a taste of some of the features soon!