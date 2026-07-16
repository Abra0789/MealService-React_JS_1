precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

uniform vec3 uScrollColor;
uniform vec3 uTargetColor;

varying vec2 vUv;



float random(vec2 st){

    return fract(
        sin(
            dot(
                st.xy,
                vec2(12.9898,78.233)
            )
        )
        *
        43758.5453123
    );

}



float noise(vec2 st){

    vec2 i = floor(st);

    vec2 f = fract(st);


    float a = random(i);

    float b = random(i + vec2(1.0,0.0));

    float c = random(i + vec2(0.0,1.0));

    float d = random(i + vec2(1.0,1.0));


    vec2 u = f*f*(3.0-2.0*f);


    return mix(a,b,u.x)
    +
    (c-a)
    *
    u.y
    *
    (1.0-u.x)
    +
    (d-b)
    *
    u.x
    *
    u.y;

}





float fbm(vec2 st){

    float value = 0.0;

    float amplitude = 0.5;


    mat2 rot = mat2(
        0.80,-0.60,
        0.60,0.80
    );


    for(int i=0;i<6;i++){

        value += amplitude * noise(st);


        st = rot * st * 2.02 + 0.25;


        amplitude *= 0.5;

    }


    return value;

}





vec2 rotate(vec2 p,float angle){

    float s = sin(angle);

    float c = cos(angle);


    return mat2(
        c,-s,
        s,c
    ) * p;

}







void main(){


    vec2 uv = vUv;



    // Glass refraction

    float distortion = fbm(
        uv*4.0 +
        uTime*0.04
    );


    uv += distortion*0.012;





    vec2 p = uv-0.5;


    p.x *= uResolution.x/uResolution.y;





    p = rotate(
        p,
        sin(uTime*0.08)*0.15
    );







    // Cursor movement

    vec2 mouse = uMouse-0.5;


    mouse.x *= uResolution.x/uResolution.y;


    float dist = distance(
        p,
        mouse
    );



    p += mouse *
    0.05 *
    exp(-dist*5.0);









    // Liquid flow


    float flow1 = fbm(
        p*2.0+
        uTime*0.08
    );


    float flow2 = fbm(
        p*3.5-
        uTime*0.05
    );


    float flow = mix(
        flow1,
        flow2,
        0.5
    );









    // Colors


    vec3 color = mix(

        uScrollColor,

        mix(
            uScrollColor,
            vec3(
                1.0,
                0.90,
                0.65
            ),
            0.5
        ),

        smoothstep(
            0.15,
            0.85,
            flow
        )

    );




    color = mix(

        color,

        vec3(
            0.99,
            0.98,
            0.96
        ),

        smoothstep(
            0.75,
            1.0,
            flow
        )

    );









    // Soft aurora


    float aurora = fbm(

        p*4.0 +

        vec2(
            uTime*0.03,
            -uTime*0.02
        )

    );



    color +=

    uTargetColor *

    aurora *

    0.08;









    // Center glow


    float centerGlow = exp(
        -length(p)*2.2
    );


    color +=

    uTargetColor *

    centerGlow *

    0.12;









    // Mouse glow


    float mouseGlow = exp(
        -dist*8.0
    );


    color +=

    uScrollColor *

    mouseGlow *

    0.18;









    // Bloom


    float bloom = smoothstep(
        0.4,
        1.0,
        flow
    );


    color += bloom *
    vec3(
        0.05,
        0.03,
        0.01
    );









    // Light contrast


    color = mix(

        color,

        color*color,

        0.04

    );









    // Grain


    float grain = random(
        gl_FragCoord.xy+
        uTime
    );


    color +=
    (grain-0.5)*0.01;









    /*
       VERY SOFT EDGE
       black almost removed
    */


    float edge = smoothstep(
        1.8,
        0.3,
        length(p)
    );


    color = mix(

        color*0.99,

        color,

        edge

    );









    // Gamma


    color = pow(
        color,
        vec3(0.95)
    );



    color = clamp(
        color,
        0.0,
        1.0
    );




    gl_FragColor = vec4(
        color,
        0.75
    );


}