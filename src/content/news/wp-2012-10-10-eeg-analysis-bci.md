---
title: "EEG Analysis &amp; BCI"
date: "2012-10-10"
author: "seungminkim"
category: "ai"
summary: "BCI team member : Younghak Shin, Seungchan Lee, Seungyun Choe, Yongwoo Lee, Konrad This project has been supported by \"Basic Research Projects in High-tech Industrial Technology\" P…"
source: "heungno.net WordPress archive"
---

BCI team member : Younghak Shin, Seungchan Lee, Seungyun Choe, Yongwoo Lee, Konrad

This project has been supported by "Basic Research Projects in High-tech Industrial Technology" Project through a grant provided by GIST in 2014.

### BCI (Brain Computer Interface) system

![](https://heungno.net/wp-content/uploads/2012/10/BCI.jpg "BCI system")

BCI provides a new communication and control channel between people and external device. In this system, users can control an external device only using his intend or imagination without making any real muscle movement.

Research goals : Through closed loop BCI system structure, we aim to provide real-time neuro-feedback to users.

This research consists of three parts : Wireless BCI

![](https://heungno.net/wp-content/uploads/2012/10/bci_system.jpg)

### Wireless BCI systems

![system](https://heungno.net/wp-content/uploads/2012/10/system.jpg)

* Conventional BCI systems are wired. The acquisition part of wired BCI systems generally comes with bulky, heavy and complicated connections with a large number of cables. For these reasons, preparation time for measuring EEG signals is typically very long. In addition, user’s movement is limited due to cable constraints.
* Design of wireless BCI systems is to provide easy, and long-time EEG acquisition for real-time neuro-feedback environment.
* The system development includes :

1. Development of active dry electrodes  
2. Design of embedded system for EEG acquisition  
3. Design of EEGcap

* Currently, we designed active dry electrodes and embedded system for EEG acquisition, and now making prototype system.

### Mobile BCI Application

We are now developing Android application for BCI system: [INFONET BCI]

![](https://heungno.net/wp-content/uploads/2012/10/bci_app.png)

This application includes :

1. Communication with EEG(electroencephalography or brain wave) devices
2. Signal Processing
3. Application(keyboard with brainwave, remote control of helicopter and plot signal..)

Currently, we are developing BCI keyboard for android. Since android has limited size of display, we need an algorithm to select words faster. Mixing Huffman code and Chosung searching.

The goal of [INFONET BCI] is make EEG signal replaces general input source – touchscreen

### A Quick and Easy BCI Speller System for Android Mobile Application

![Fig 2](https://heungno.net/wp-content/uploads/2012/10/Fig-2.png)     ![Fig 1](https://heungno.net/wp-content/uploads/2012/10/Fig-1.png)  
 ![Fig 3](https://heungno.net/wp-content/uploads/2012/10/Fig-3.png)     ![Fig 4](https://heungno.net/wp-content/uploads/2012/10/Fig-4.png)  
 ![Fig 5](https://heungno.net/wp-content/uploads/2012/10/Fig-5.png)

* Conventional BCI speller systems have several of problems.  
  1. User who have to use BCI speller uses only a few of sentence in several situation suck like emergency room, patient's room and their home.  
  2. It takes a long time to spell a full sentence which user wants to input.  
  3. Most of the conventional BCI spellers are experimented with large display such like CRT monitor.  
  4. Mobile devices have a limited size of display to adjust conventional speller paradigm.
* This speller system enable user to rapidly spell a full sentence just inputting 2 Choseongs.
* In this BCI speller system, Emotiv EPOC is used as EEG measurement device.
* This speller system consists of Emotiv EPOC headset, Java console program and Android application.
* Video of demonstraion (User can input a full sentence '괜찮습니다' through inputting 2 Choseongs:ㄱ, ㅊ) - <https://youtu.be/EBQfn5390Ws>

### BCI Signal Processing

![fig1](https://heungno.net/wp-content/uploads/2012/10/fig1.jpg)

In the BCI systems, EEG signal processing is important part for reliable system.  
We focus on pattern recognition and machine learning techniques for BCI control.

**Sparse representation based classification (SRC)**

![fig2](https://heungno.net/wp-content/uploads/2012/10/fig2.jpg)

We propose a SRC method for motor imagery based BCI applications.  
In the SRC, dictionary A is simply formed by collecting the input training feature vectors as the columns of the dictionary. Then, using the dictionary, sparse representation is performed for each test signal y  
Click below link for related paper and source code: https://heungno.net/?page\_id=1637

### Related movie clips

BCI 1D cursor control experiment  :   <https://youtu.be/5tzY35Tt4Uo>

**Video of Controlled Helicopter**  :   <https://youtu.be/k68anrPMKvs>

We are looking for domestic/international interns, MS and Ph.D. student researchers. Anyone who have interested in our topic please contact us. (shinyh@gist.ac.kr)

* Wireless BCI systems : firmware programming for microcontrollers(TI MSP430, STM32), analog and digital circuits design
* Mobile BCI applications : Android programming, JAVA, C++
* Signal Processing : Matlab, Pattern recognition, Machine learning
