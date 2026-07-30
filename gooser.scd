
(
SynthDef(\tone, {
	| freq = 200, env, sig |
	sig = Pulse.ar(freq, 0.5);
	env = EnvGen.ar(Env.perc(0.01, 0.5), doneAction: 2);
	sig = sig * env;
	Out.ar(0, sig);
}).add;
)


(
 a = Pbind(
	\tempo, 0.9,
	\instrument, \tone,
	\degree, Pseq([0,4,3,2,3,5,2,0,5,5,4,4,7,2,1], 1),
	\dur, 0.25,
	\amp, 0.2
);

 b = Pbind(
	\tempo, 0.9,
	\instrument, \tone,
	\degree, Pseq([0,0,1,0,0,3,0,0,3,1,2,0,0,0,0], 1),
	\dur, 0.25,
	\amp, 0.2
);

Ppar([a, b]).play;
)