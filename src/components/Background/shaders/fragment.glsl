precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uScrollColor;
uniform vec3 uTargetColor;
vec3 colorA = uScrollColor;

varying vec2 vUv;

#define PI 3.14159265359

float random(vec2 st){

    return fract(

        sin(

            dot(
                st.xy,
                vec2(
                    12.9898,
                    78.233
                )
            )

        )*43758.5453123

    );

}

float noise(vec2 st){

    vec2 i = floor(st);

    vec2 f = fract(st);

    float a = random(i);

    float b = random(i + vec2(1.0, 0.0));

    float c = random(i + vec2(0.0, 1.0));

    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x)
         + (c - a) * u.y * (1.0 - u.x)
         + (d - b) * u.x * u.y;

}

float fbm(vec2 st){

    float value = 0.0;

    float amplitude = 0.5;

    mat2 rot = mat2(
        0.80, -0.60,
        0.60,  0.80
    );

    for(int i = 0; i < 6; i++){

        value += amplitude * noise(st);

        st = rot * st * 2.02 + 0.25;

        amplitude *= 0.5;

    }

    return value;

}

vec2 rotate(vec2 p, float angle){

    float s = sin(angle);

    float c = cos(angle);

    return mat2(
        c, -s,
        s,  c
    ) * p;

}

void main(){

    vec2 uv = vUv;
    float distortion = fbm(
    uv * 4.0 + uTime * 0.05
);


uv += distortion * 0.015;

    vec2 p = uv - 0.5;

    p.x *= uResolution.x / uResolution.y;

    p = rotate(
        p,
        sin(uTime * 0.08) * 0.18
    );

    vec2 mouse = uMouse - 0.5;

    mouse.x *=
        uResolution.x /
        uResolution.y;

    float dist = distance(
        p,
        mouse
    );

    p += mouse
        * 0.08
        * exp(-dist * 4.5);

    float flow1 = fbm(
        p * 2.0 +
        uTime * 0.08
    );

    float flow2 = fbm(
        p * 3.4 -
        uTime * 0.05
    );

    float flow = mix(
        flow1,
        flow2,
        0.5
    );

    vec3 colorA = uTargetColor;

vec3 colorB = mix(
    uTargetColor,
    vec3(
        1.0,
        0.85,
        0.55
    ),
    0.5
);

vec3 colorC = vec3(
    0.99,
    0.97,
    0.94
);
    vec3 color = mix(
        colorA,
        colorB,
        smoothstep(
            0.18,
            0.82,
            flow
        )
    );

    color = mix(
        color,
        colorC,
        smoothstep(
            0.70,
            1.00,
            flow
        )
    );

    float aurora = fbm(
        p * 4.0 +
        vec2(
            uTime * 0.04,
            -uTime * 0.03
        )
    );

    color += uTargetColor 
    * aurora 
    * 0.12;
        /* ===========================
       Center Glow
    =========================== */

    float centerGlow = exp(
        -length(p) * 2.6
    );

    color += uTargetColor
    * centerGlow
    * 0.12;

    /* ===========================
       Mouse Glow
    =========================== */

    float mouseGlow = exp(
        -dist * 7.5
    );

    color += uScrollColor 
    * mouseGlow 
    * 0.18;

    /* ===========================
       Soft Bloom
    =========================== */

    float bloom = smoothstep(
        0.45,
        1.00,
        flow
    );

    color += bloom * vec3(
        0.08,
        0.05,
        0.02
    );

    /* ===========================
       Contrast
    =========================== */

    color = mix(
        color,
        color * color,
        0.08
    );
        /* ===========================
       Film Grain
    =========================== */

    float grain = random(
        gl_FragCoord.xy +
        uTime * 100.0
    );

    color += (grain - 0.5) * 0.018;

    /* ===========================
       Vignette
    =========================== */

    float vignette = smoothstep(
        1.25,
        0.25,
        length(p)
    );

    color *= vignette;

    /* ===========================
       Gamma Correction
    =========================== */

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
        1.0
    );

}