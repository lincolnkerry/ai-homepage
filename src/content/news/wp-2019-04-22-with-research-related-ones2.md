---
title: "[AI-post 2]"
date: "2019-04-22"
author: "jskang"
category: "lab"
summary: "AI 연구소 중 top tear 인 Deepmind 블로그를 보다, 재미있는 내용들이 보여 몇개 짧게나마 소개 드려보고자 합니다. 관심있으신 분들은 읽어보셔도 좋을 것 같습니다. 1. Machine learning can boost the value of wind energy - Deepmind 팀에서 전력량 예측에도 도…"
source: "heungno.net WordPress archive"
---

AI 연구소 중 top tear 인 Deepmind 블로그를 보다, 재미있는 내용들이 보여 몇개 짧게나마 소개 드려보고자 합니다. 관심있으신 분들은 읽어보셔도 좋을 것 같습니다.
1. Machine learning can boost the value of wind energy
- Deepmind 팀에서 전력량 예측에도 도전하는 듯 합니다. 작년부터 풍력 발전소 기준 전력 ‘생산량’ 예측에 도전하고 있습니다. ‘소요량’이 아닌 ‘생산량’ 예측 이라는 점에서 아쉽기는 하나, 효율을 20% 이상 향상 시켰다고 하니, 곧 나올 논문을 즐거운 마음으로 기다려보는 것도 좋을 것 같습니다.
[ref 1] https://deepmind.com/blog/machine-learning-can-boost-value-wind-energy/
2. TF-Replicator : Distributed Machine Learning for Researchers
- TF 2.0 부터 (Cloud) TPU 기반 Distributed learning 을 위한 API를 제공한다는 내용입니다. [보니까 자기네들이 TPU를 활용하기 위해 만든 API를, cloud 형태로 사용할 수 있게 공개한 듯 보입니다. 역시 갓마인드 =ㅇ=ㅋ] 기본적으로 TPU 유닛 기반에 적용 가능한 듯 한데… (Graph 구조를 보면, GPU core 간 communication 이 필요해 보입니다.) 다시 읽어보니 GPU 기반에도 core comm.만 가능하면 가능할 지 모르겠다 싶은 생각입니다. SLI 이상 쓰시는 분들이 계시면 한번 API 문서 뒤져보는 것도 좋을 것 같다는 생각입니다.
[ref 2] https://deepmind.com/blog/tf-replicator-distributed-machine-learning/
3. Towards Robust and Verified AI: Specification Testing, Robust Training, and Formal Verification
- 학습론에 대한 내용입니다. Avg. 성능이 아닌 Specification 이라 명명된 특수한 경우 (e.x. 특히 성능이 안좋은 하나의 case)를 이용한 시스템 testing, training, 그리고 verification 방법에 대해 소개하고 있습니다. 아직 완독하진 못했지만, 학습론이다 보니 분야에 상관없이 한번쯤 읽어보시면 좋을 것 같습니다. Keyword는 Adversarial testing, Robust learning 그리고 Formal verification 입니다.
[ref 3] https://deepmind.com/blog/robust-and-verified-ai/
4. Unsupervised learning: the curious pupil
- Unsupervised learning 에 대한 내용입니다. UL은 학습하는 데이터 그 자체를 이해하는 것이 중요하다 이야기 하며, Vision 정보를 이해하는 법(AlexNet), Transfer learning, 만들어서 학습하는 법(GAN), 그리고 예측하여 생성하는 법 (Autoregressive model) 등을 연결하고 있습니다. 이론 보다는 UL 관점에서 각각의 기술 요소들을 연이어 생각할 수 있다는 점에서 좋았던 것 같습니다. Meepmind 에서 UL을 바라보는 관점에 대해 알 수 있으니, 관심있으신 분들은 참조하시면 좋을 것 같습니다.
[ref 4] https://deepmind.com/blog/unsupervised-learning/
