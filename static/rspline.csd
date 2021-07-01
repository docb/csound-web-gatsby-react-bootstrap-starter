<CsoundSynthesizer>

<CsOptions>
;-odac -Ma -m128 
-odac -Ma -dm0
</CsOptions>

<CsInstruments>
sr = 48000
ksmps = 32
nchnls = 2
0dbfs = 1

#ifdef directmidi
massign 0,1
#else
massign 0,0
#end

opcode freqtrigger,0,iiii
  insno,ion,ifreq,ivel xin
  print insno,ion,ifreq,ivel
  if ion == 1 then
    event "i",insno+(ifreq*0.00001),0,-1,ifreq,ivel
  else
    turnoff2 insno+(ifreq*0.00001),4,1
  endif
endop

opcode notetrigger,0,iiii
  insno,ion,ikey,ivel xin
  ifreq = cpsmidinn(ikey)
  freqtrigger insno,ion,ifreq,ivel
endop


#ifdef directmidi
instr miditrig
  midinoteonkey p4,p5
  xtratim 1/kr
  schedule "trig",0,0.1,1,p4,p5
  if lastcycle() == 1 then
    schedulek "trig",0,0.1,0,p4,p5
  endif
endin
#end

opcode master,0,aakk
  ainL,ainR,kamp,krev xin
  aL = ainL*kamp
  aR = ainR*kamp
  arL = aL*krev
  arR = aR*krev
  chnmix arL,"revInL"
  chnmix arR,"revInR"
  chnmix aL,"mixL"
  chnmix aR,"mixR"
endop

giwave1 ftgen 0,0,65537,10,0
giwave2 ftgen 0,0,65537,10,0
giwave3 ftgen 0,0,65537,10,0
giwave4 ftgen 0,0,65537,10,0

giwaves[] fillarray giwave1,giwave2,giwave3,giwave4

opcode ogentrig,0,k
  knr xin
  ks chnget sprintfk("waveseed_%d",knr)
  klen chnget sprintfk("wavesteps_%d",knr)
  if klen < 4 then
    klen = 4
  endif
  ktrig changed ks,klen
  if ktrig == 1 then
    schedulek "genwave",0,-1, knr, ks, klen
  endif
endop


gipdf ftgen 0,0,65536,-42,-0.9,-0.2,0.5,0.2,0.9,0.5
instr genwave
    seed p5
    ilen limit p6,4,16
    ivals[] init 17
    ivals[0] = 0
    indx = 1
    while indx<16 do
      ivals[indx] duserrnd gipdf
      indx += 1
    od
    ivals[16] = 0
    indx = 15
    // ensure the last point is zero
    while indx >= ilen do
      ivals[indx] = 0
      indx -= 1
    od
    isteplen = 65536/ilen
    idummy ftgen giwaves[p4],0,65537,8,ivals[0],isteplen,ivals[1],isteplen,ivals[2],isteplen,ivals[3],isteplen,ivals[4],isteplen,ivals[5],isteplen,ivals[6],isteplen,ivals[7],isteplen,ivals[8],isteplen,ivals[9],isteplen,ivals[10],isteplen,ivals[11],isteplen,ivals[12],isteplen,ivals[13],isteplen,ivals[14],isteplen,ivals[15],isteplen,ivals[16]
   turnoff
endin

turnon "gentrig"
instr gentrig
  ogentrig 0
  ogentrig 1
  ogentrig 2
  ogentrig 3
endin
chnset 0.6,"amp"
chnset 0.0,"rev"
chnset 10,"wavesteps_0"
chnset 10,"wavesteps_1"
chnset 10,"wavesteps_2"
chnset 10,"wavesteps_3"
chnset 1000,"waveseed_0"
chnset 1001,"waveseed_1"
chnset 1002,"waveseed_2"
chnset 1003,"waveseed_3"
chnset 0.01,"adsr1_a"
chnset 0.01,"adsr1_d"
chnset 1,"adsr1_s"
chnset 0.07,"adsr1_r"
chnset 0.1,"weight"
chnset 2,"num1"
chnset 0.5,"num2"

instr rspline
  ivel = p5/127
  ibasefrq = p4
  print p4,ibasefrq,ivel
  kz chnget "weight"
  kx chnget "num1"
  ky chnget "num2"

  aw interp kz
  anum1 interp kx
  anum2 interp ky
  
  aindex phasor ibasefrq
  aoscL tabmorpha aindex, aw, anum1, anum2, giwaves[0], giwaves[1], giwaves[2], giwaves[3]
  aoscR tabmorpha aindex, aw, anum2, anum1, giwaves[0], giwaves[1], giwaves[2], giwaves[3]
  aoscL dcblock2 aoscL
  aoscR dcblock2 aoscR

  ia chnget "adsr1_a"
  id chnget "adsr1_d"
  is chnget "adsr1_s"
  ir chnget "adsr1_r"
  aenv madsr ia,id,is,ir
  aoscL = aoscL * aenv 
  aoscR = aoscR * aenv

  kamp chnget "amp"
  krev chnget "rev"
  master aoscL,aoscR,kamp*ivel/4,krev
endin
turnon "creverb"
instr creverb
  krevfb=0.8
  krevfreq=1
  aL chnget "revInL"
  aR chnget "revInR"
  arevL,arevR reverbsc aL, aR, krevfb, 15000
  chnmix arevL,"mixL"
  chnmix arevR,"mixR"
endin
turnon "Mixer"
instr Mixer
  aL chnget "mixL"
  aR chnget "mixR"
  outs aL,aR
  chnclear "mixL", "mixR","revInL","revInR"
endin

instr trig
  insno = nstrnum("rspline") 
  notetrigger insno,p4,p5,p6
  turnoff
endin

/* for other tunings */
instr freqtrig
  insno = nstrnum("rspline") 
  freqtrigger insno,p4,p5,p6
  turnoff
endin


</CsInstruments>

<CsScore>
;i 1 0 0.1 1 60 60
;i 1 0.5 0.1 1 62 60
;i 1 2 0.1 0 60 60
;i 1 2.5 0.1 0 62 60
</CsScore>
</CsoundSynthesizer>
