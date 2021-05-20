class Satellite{
    constructor(x,y,radius){
        var options = {
            restitution: 1,
            friction: 0,
            density: 1.2
        }
        this.radius = radius;
        this.body = Bodies.circle(x,y,radius,options);
        this.image = sat_image;
        World.add(world,this.body);
    }

    display(){
        var pos = this.body.position;
        var angle = this.body.angle;
        push();
        translate(pos.x,pos.y);
        rotate(angle);
        fill("silver");
        //ellipseMode(RADIUS);
        //ellipse(0,0,this.radius,this.radius);
        imageMode(CENTER);
        image(this.image,0,0,this.radius+37.5,this.radius+37.5);
        pop();
    }
}