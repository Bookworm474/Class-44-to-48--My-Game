class Planet{
    constructor(x,y,radius,image){
        var options = {
            isStatic: true,
            restitution: 0.3,
            density: 1.7,
            friction: 0.3
        }

        this.body = Bodies.circle(x,y,radius,options);
        this.radius = radius;
        this.counter = 0;
        this.image = image;

        World.add(world,this.body);
    }

    display(){
        var pos = this.body.position;
        var angle = this.body.angle;
        push();
        translate(pos.x,pos.y);
        rotate(angle);
        imageMode(CENTER);
        image(this.image,0,0,this.radius,this.radius);
        pop();
    }
}