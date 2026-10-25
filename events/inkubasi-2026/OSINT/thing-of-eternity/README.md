# Thing of Eternity
> Category: osint
> Author: 2byte

## Description
On November 23, 2025, at 23:36, some of npm packages was reportedly compromised by a worm delivered through malicious "imposter commits". The incident quickly spread across multiple GitHub repositories, leading to widespread infections and exposing several cloud and development environments to public breach.

> Over here sand blows, over there sand blows. Over there a rich man waits, over here I wait.

**THE SCOPE OF THE CHALLENGE IS RESTRICTED. NO EXPLOITATION OF OTHER BREACHED DATA IS PERMITTED. ANY OUT-OF-SCOPE EXPLOITATION WILL RESULT IN A BAN FROM CURRENT AND FUTURE EVENTS.**

## PoC
1. desc referensi ke shai-hulud v2 worm
2. ioc kl breached data itu desc repo "Sha1-Hulud: The Second Coming"
3. pake filter https://github.com/search?q=Sha1-Hulud%3A+The+Second+Coming.&ref=opensearch&type=repositories&s=updated&o=desc
4. ada repo dari poros-sec
5. decode environtment.json

## Flag
```
PorosCTF{bin9un9_ch411_7hr347_in731_9ini_m4u_m45ukin_k3_05in7_4p4_f0r3n5ic_7p_ywdh_1h}
```
