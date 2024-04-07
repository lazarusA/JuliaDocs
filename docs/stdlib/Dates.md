
# Dates {#Dates}



The `Dates` module provides two types for working with dates: [`Date`](/stdlib/Dates#Dates.Date) and [`DateTime`](/stdlib/Dates#Dates.DateTime), representing day and millisecond precision, respectively; both are subtypes of the abstract [`TimeType`](/stdlib/Dates#Dates.TimeType). The motivation for distinct types is simple: some operations are much simpler, both in terms of code and mental reasoning, when the complexities of greater precision don&#39;t have to be dealt with. For example, since the [`Date`](/stdlib/Dates#Dates.Date) type only resolves to the precision of a single date (i.e. no hours, minutes, or seconds), normal considerations for time zones, daylight savings/summer time, and leap seconds are unnecessary and avoided.

Both [`Date`](/stdlib/Dates#Dates.Date) and [`DateTime`](/stdlib/Dates#Dates.DateTime) are basically immutable [`Int64`](/base/numbers#Core.Int64) wrappers. The single `instant` field of either type is actually a `UTInstant{P}` type, which represents a continuously increasing machine timeline based on the UT second [^1]. The [`DateTime`](/stdlib/Dates#Dates.DateTime) type is not aware of time zones (_naive_, in Python parlance), analogous to a _LocalDateTime_ in Java 8. Additional time zone functionality can be added through the [TimeZones.jl package](https://github.com/JuliaTime/TimeZones.jl/), which compiles the [IANA time zone database](https://www.iana.org/time-zones). Both [`Date`](/stdlib/Dates#Dates.Date) and [`DateTime`](/stdlib/Dates#Dates.DateTime) are based on the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) standard, which follows the proleptic Gregorian calendar. One note is that the ISO 8601 standard is particular about BC/BCE dates. In general, the last day of the BC/BCE era, 1-12-31 BC/BCE, was followed by 1-1-1 AD/CE, thus no year zero exists. The ISO standard, however, states that 1 BC/BCE is year zero, so `0000-12-31` is the day before `0001-01-01`, and year `-0001` (yes, negative one for the year) is 2 BC/BCE, year `-0002` is 3 BC/BCE, etc.

[^1]: The notion of the UT second is actually quite fundamental. There are basically two different notions of time generally accepted, one based on the physical rotation of the earth (one full rotation = 1 day), the other based on the SI second (a fixed, constant value). These are radically different! Think about it, a &quot;UT second&quot;, as defined relative to the rotation of the earth, may have a different absolute length depending on the day! Anyway, the fact that [`Date`](/stdlib/Dates#Dates.Date) and [`DateTime`](/stdlib/Dates#Dates.DateTime) are based on UT seconds is a simplifying, yet honest assumption so that things like leap seconds and all their complexity can be avoided. This basis of time is formally called [UT](https://en.wikipedia.org/wiki/Universal_Time) or UT1. Basing types on the UT second basically means that every minute has 60 seconds and every day has 24 hours and leads to more natural calculations when working with calendar dates.


## Constructors {#Constructors}

[`Date`](/stdlib/Dates#Dates.Date) and [`DateTime`](/stdlib/Dates#Dates.DateTime) types can be constructed by integer or [`Period`](/stdlib/Dates#Dates.Period) types, by parsing, or through adjusters (more on those later):

```julia
julia> DateTime(2013)
2013-01-01T00:00:00

julia> DateTime(2013,7)
2013-07-01T00:00:00

julia> DateTime(2013,7,1)
2013-07-01T00:00:00

julia> DateTime(2013,7,1,12)
2013-07-01T12:00:00

julia> DateTime(2013,7,1,12,30)
2013-07-01T12:30:00

julia> DateTime(2013,7,1,12,30,59)
2013-07-01T12:30:59

julia> DateTime(2013,7,1,12,30,59,1)
2013-07-01T12:30:59.001

julia> Date(2013)
2013-01-01

julia> Date(2013,7)
2013-07-01

julia> Date(2013,7,1)
2013-07-01

julia> Date(Dates.Year(2013),Dates.Month(7),Dates.Day(1))
2013-07-01

julia> Date(Dates.Month(7),Dates.Year(2013))
2013-07-01
```


[`Date`](/stdlib/Dates#Dates.Date) or [`DateTime`](/stdlib/Dates#Dates.DateTime) parsing is accomplished by the use of format strings. Format strings work by the notion of defining _delimited_ or _fixed-width_ &quot;slots&quot; that contain a period to parse and passing the text to parse and format string to a [`Date`](/stdlib/Dates#Dates.Date) or [`DateTime`](/stdlib/Dates#Dates.DateTime) constructor, of the form `Date("2015-01-01",dateformat"y-m-d")` or `DateTime("20150101",dateformat"yyyymmdd")`.

Delimited slots are marked by specifying the delimiter the parser should expect between two subsequent periods; so `"y-m-d"` lets the parser know that between the first and second slots in a date string like `"2014-07-16"`, it should find the `-` character. The `y`, `m`, and `d` characters let the parser know which periods to parse in each slot.

As in the case of constructors above such as `Date(2013)`, delimited `DateFormat`s allow for missing parts of dates and times so long as the preceding parts are given. The other parts are given the usual default values.  For example, `Date("1981-03", dateformat"y-m-d")` returns `1981-03-01`, whilst `Date("31/12", dateformat"d/m/y")` gives `0001-12-31`.  (Note that the default year is 1 AD/CE.) An empty string, however, always throws an `ArgumentError`.

Fixed-width slots are specified by repeating the period character the number of times corresponding to the width with no delimiter between characters. So `dateformat"yyyymmdd"` would correspond to a date string like `"20140716"`. The parser distinguishes a fixed-width slot by the absence of a delimiter, noting the transition `"yyyymm"` from one period character to the next.

Support for text-form month parsing is also supported through the `u` and `U` characters, for abbreviated and full-length month names, respectively. By default, only English month names are supported, so `u` corresponds to &quot;Jan&quot;, &quot;Feb&quot;, &quot;Mar&quot;, etc. And `U` corresponds to &quot;January&quot;, &quot;February&quot;, &quot;March&quot;, etc. Similar to other name=&gt;value mapping functions [`dayname`](/stdlib/Dates#Dates.dayname) and [`monthname`](/stdlib/Dates#Dates.monthname), custom locales can be loaded by passing in the `locale=>Dict{String,Int}` mapping to the `MONTHTOVALUEABBR` and `MONTHTOVALUE` dicts for abbreviated and full-name month names, respectively.

The above examples used the `dateformat""` string macro. This macro creates a `DateFormat` object once when the macro is expanded and uses the same `DateFormat` object even if a code snippet is run multiple times.

```julia
julia> for i = 1:10^5
           Date("2015-01-01", dateformat"y-m-d")
       end
```


Or you can create the DateFormat object explicitly:

```julia
julia> df = DateFormat("y-m-d");

julia> dt = Date("2015-01-01",df)
2015-01-01

julia> dt2 = Date("2015-01-02",df)
2015-01-02
```


Alternatively, use broadcasting:

```julia
julia> years = ["2015", "2016"];

julia> Date.(years, DateFormat("yyyy"))
2-element Vector{Date}:
 2015-01-01
 2016-01-01
```


For convenience, you may pass the format string directly (e.g., `Date("2015-01-01","y-m-d")`), although this form incurs performance costs if you are parsing the same format repeatedly, as it internally creates a new `DateFormat` object each time.

As well as via the constructors, a `Date` or `DateTime` can be constructed from strings using the [`parse`](/base/numbers#Base.parse) and [`tryparse`](/base/numbers#Base.tryparse) functions, but with an optional third argument of type `DateFormat` specifying the format; for example, `parse(Date, "06.23.2013", dateformat"m.d.y")`, or `tryparse(DateTime, "1999-12-31T23:59:59")` which uses the default format. The notable difference between the functions is that with [`tryparse`](/base/numbers#Base.tryparse), an error is not thrown if the string is empty or in an invalid format; instead `nothing` is returned.

::: tip Julia 1.9

Before Julia 1.9, empty strings could be passed to constructors and `parse` without error, returning as appropriate `DateTime(1)`, `Date(1)` or `Time(0)`. Likewise, `tryparse` did not return `nothing`.

:::

A full suite of parsing and formatting tests and examples is available in [`stdlib/Dates/test/io.jl`](https://github.com/JuliaLang/julia/blob/master/stdlib/Dates/test/io.jl).

## Durations/Comparisons {#Durations/Comparisons}

Finding the length of time between two [`Date`](/stdlib/Dates#Dates.Date) or [`DateTime`](/stdlib/Dates#Dates.DateTime) is straightforward given their underlying representation as `UTInstant{Day}` and `UTInstant{Millisecond}`, respectively. The difference between [`Date`](/stdlib/Dates#Dates.Date) is returned in the number of [`Day`](/stdlib/Dates#Dates.Day-Tuple{TimeType}), and [`DateTime`](/stdlib/Dates#Dates.DateTime) in the number of [`Millisecond`](/stdlib/Dates#Dates.Millisecond-Tuple{DateTime}). Similarly, comparing [`TimeType`](/stdlib/Dates#Dates.TimeType) is a simple matter of comparing the underlying machine instants (which in turn compares the internal [`Int64`](/base/numbers#Core.Int64) values).

```julia
julia> dt = Date(2012,2,29)
2012-02-29

julia> dt2 = Date(2000,2,1)
2000-02-01

julia> dump(dt)
Date
  instant: Dates.UTInstant{Day}
    periods: Day
      value: Int64 734562

julia> dump(dt2)
Date
  instant: Dates.UTInstant{Day}
    periods: Day
      value: Int64 730151

julia> dt > dt2
true

julia> dt != dt2
true

julia> dt + dt2
ERROR: MethodError: no method matching +(::Date, ::Date)
[...]

julia> dt * dt2
ERROR: MethodError: no method matching *(::Date, ::Date)
[...]

julia> dt / dt2
ERROR: MethodError: no method matching /(::Date, ::Date)

julia> dt - dt2
4411 days

julia> dt2 - dt
-4411 days

julia> dt = DateTime(2012,2,29)
2012-02-29T00:00:00

julia> dt2 = DateTime(2000,2,1)
2000-02-01T00:00:00

julia> dt - dt2
381110400000 milliseconds
```


## Accessor Functions {#Accessor-Functions}

Because the [`Date`](/stdlib/Dates#Dates.Date) and [`DateTime`](/stdlib/Dates#Dates.DateTime) types are stored as single [`Int64`](/base/numbers#Core.Int64) values, date parts or fields can be retrieved through accessor functions. The lowercase accessors return the field as an integer:

```julia
julia> t = Date(2014, 1, 31)
2014-01-31

julia> Dates.year(t)
2014

julia> Dates.month(t)
1

julia> Dates.week(t)
5

julia> Dates.day(t)
31
```


While propercase return the same value in the corresponding [`Period`](/stdlib/Dates#Dates.Period) type:

```julia
julia> Dates.Year(t)
2014 years

julia> Dates.Day(t)
31 days
```


Compound methods are provided because it is more efficient to access multiple fields at the same time than individually:

```julia
julia> Dates.yearmonth(t)
(2014, 1)

julia> Dates.monthday(t)
(1, 31)

julia> Dates.yearmonthday(t)
(2014, 1, 31)
```


One may also access the underlying `UTInstant` or integer value:

```julia
julia> dump(t)
Date
  instant: Dates.UTInstant{Day}
    periods: Day
      value: Int64 735264

julia> t.instant
Dates.UTInstant{Day}(Day(735264))

julia> Dates.value(t)
735264
```


## Query Functions {#Query-Functions}

Query functions provide calendrical information about a [`TimeType`](/stdlib/Dates#Dates.TimeType). They include information about the day of the week:

```julia
julia> t = Date(2014, 1, 31)
2014-01-31

julia> Dates.dayofweek(t)
5

julia> Dates.dayname(t)
"Friday"

julia> Dates.dayofweekofmonth(t) # 5th Friday of January
5
```


Month of the year:

```julia
julia> Dates.monthname(t)
"January"

julia> Dates.daysinmonth(t)
31
```


As well as information about the [`TimeType`](/stdlib/Dates#Dates.TimeType)&#39;s year and quarter:

```julia
julia> Dates.isleapyear(t)
false

julia> Dates.dayofyear(t)
31

julia> Dates.quarterofyear(t)
1

julia> Dates.dayofquarter(t)
31
```


The [`dayname`](/stdlib/Dates#Dates.dayname) and [`monthname`](/stdlib/Dates#Dates.monthname) methods can also take an optional `locale` keyword that can be used to return the name of the day or month of the year for other languages/locales. There are also versions of these functions returning the abbreviated names, namely [`dayabbr`](/stdlib/Dates#Dates.dayabbr) and [`monthabbr`](/stdlib/Dates#Dates.monthabbr). First the mapping is loaded into the `LOCALES` variable:

```julia
julia> french_months = ["janvier", "février", "mars", "avril", "mai", "juin",
                        "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

julia> french_months_abbrev = ["janv","févr","mars","avril","mai","juin",
                              "juil","août","sept","oct","nov","déc"];

julia> french_days = ["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"];

julia> Dates.LOCALES["french"] = Dates.DateLocale(french_months, french_months_abbrev, french_days, [""]);
```


The above mentioned functions can then be used to perform the queries:

```julia
julia> Dates.dayname(t;locale="french")
"vendredi"

julia> Dates.monthname(t;locale="french")
"janvier"

julia> Dates.monthabbr(t;locale="french")
"janv"
```


Since the abbreviated versions of the days are not loaded, trying to use the function `dayabbr` will throw an error.

```julia
julia> Dates.dayabbr(t;locale="french")
ERROR: BoundsError: attempt to access 1-element Vector{String} at index [5]
Stacktrace:
[...]
```


## TimeType-Period Arithmetic {#TimeType-Period-Arithmetic}

It&#39;s good practice when using any language/date framework to be familiar with how date-period arithmetic is handled as there are some [tricky issues](https://codeblog.jonskeet.uk/2010/12/01/the-joys-of-date-time-arithmetic/) to deal with (though much less so for day-precision types).

The `Dates` module approach tries to follow the simple principle of trying to change as little as possible when doing [`Period`](/stdlib/Dates#Dates.Period) arithmetic. This approach is also often known as _calendrical_ arithmetic or what you would probably guess if someone were to ask you the same calculation in a conversation. Why all the fuss about this? Let&#39;s take a classic example: add 1 month to January 31st, 2014. What&#39;s the answer? Javascript will say [March 3](https://markhneedham.com/blog/2009/01/07/javascript-add-a-month-to-a-date/) (assumes 31 days). PHP says [March 2](https://stackoverflow.com/questions/5760262/php-adding-months-to-a-date-while-not-exceeding-the-last-day-of-the-month) (assumes 30 days). The fact is, there is no right answer. In the `Dates` module, it gives the result of February 28th. How does it figure that out? Consider the classic 7-7-7 gambling game in casinos.

Now just imagine that instead of 7-7-7, the slots are Year-Month-Day, or in our example, 2014-01-31. When you ask to add 1 month to this date, the month slot is incremented, so now we have 2014-02-31. Then the day number is checked if it is greater than the last valid day of the new month; if it is (as in the case above), the day number is adjusted down to the last valid day (28). What are the ramifications with this approach? Go ahead and add another month to our date, `2014-02-28 + Month(1) == 2014-03-28`. What? Were you expecting the last day of March? Nope, sorry, remember the 7-7-7 slots. As few slots as possible are going to change, so we first increment the month slot by 1, 2014-03-28, and boom, we&#39;re done because that&#39;s a valid date. On the other hand, if we were to add 2 months to our original date, 2014-01-31, then we end up with 2014-03-31, as expected. The other ramification of this approach is a loss in associativity when a specific ordering is forced (i.e. adding things in different orders results in different outcomes). For example:

```julia
julia> (Date(2014,1,29)+Dates.Day(1)) + Dates.Month(1)
2014-02-28

julia> (Date(2014,1,29)+Dates.Month(1)) + Dates.Day(1)
2014-03-01
```


What&#39;s going on there? In the first line, we&#39;re adding 1 day to January 29th, which results in 2014-01-30; then we add 1 month, so we get 2014-02-30, which then adjusts down to 2014-02-28. In the second example, we add 1 month _first_, where we get 2014-02-29, which adjusts down to 2014-02-28, and _then_ add 1 day, which results in 2014-03-01. One design principle that helps in this case is that, in the presence of multiple Periods, the operations will be ordered by the Periods&#39; _types_, not their value or positional order; this means `Year` will always be added first, then `Month`, then `Week`, etc. Hence the following _does_ result in associativity and Just Works:

```julia
julia> Date(2014,1,29) + Dates.Day(1) + Dates.Month(1)
2014-03-01

julia> Date(2014,1,29) + Dates.Month(1) + Dates.Day(1)
2014-03-01
```


Tricky? Perhaps. What is an innocent `Dates` user to do? The bottom line is to be aware that explicitly forcing a certain associativity, when dealing with months, may lead to some unexpected results, but otherwise, everything should work as expected. Thankfully, that&#39;s pretty much the extent of the odd cases in date-period arithmetic when dealing with time in UT (avoiding the &quot;joys&quot; of dealing with daylight savings, leap seconds, etc.).

As a bonus, all period arithmetic objects work directly with ranges:

```julia
julia> dr = Date(2014,1,29):Day(1):Date(2014,2,3)
Date("2014-01-29"):Day(1):Date("2014-02-03")

julia> collect(dr)
6-element Vector{Date}:
 2014-01-29
 2014-01-30
 2014-01-31
 2014-02-01
 2014-02-02
 2014-02-03

julia> dr = Date(2014,1,29):Dates.Month(1):Date(2014,07,29)
Date("2014-01-29"):Month(1):Date("2014-07-29")

julia> collect(dr)
7-element Vector{Date}:
 2014-01-29
 2014-02-28
 2014-03-29
 2014-04-29
 2014-05-29
 2014-06-29
 2014-07-29
```


## Adjuster Functions {#Adjuster-Functions}

As convenient as date-period arithmetic is, often the kinds of calculations needed on dates take on a _calendrical_ or _temporal_ nature rather than a fixed number of periods. Holidays are a perfect example; most follow rules such as &quot;Memorial Day = Last Monday of May&quot;, or &quot;Thanksgiving = 4th Thursday of November&quot;. These kinds of temporal expressions deal with rules relative to the calendar, like first or last of the month, next Tuesday, or the first and third Wednesdays, etc.

The `Dates` module provides the _adjuster_ API through several convenient methods that aid in simply and succinctly expressing temporal rules. The first group of adjuster methods deal with the first and last of weeks, months, quarters, and years. They each take a single [`TimeType`](/stdlib/Dates#Dates.TimeType) as input and return or _adjust to_ the first or last of the desired period relative to the input.

```julia
julia> Dates.firstdayofweek(Date(2014,7,16)) # Adjusts the input to the Monday of the input's week
2014-07-14

julia> Dates.lastdayofmonth(Date(2014,7,16)) # Adjusts to the last day of the input's month
2014-07-31

julia> Dates.lastdayofquarter(Date(2014,7,16)) # Adjusts to the last day of the input's quarter
2014-09-30
```


The next two higher-order methods, [`tonext`](/stdlib/Dates#Dates.tonext-Tuple{TimeType,%20Int64}), and [`toprev`](/stdlib/Dates#Dates.toprev-Tuple{TimeType,%20Int64}), generalize working with temporal expressions by taking a `DateFunction` as first argument, along with a starting [`TimeType`](/stdlib/Dates#Dates.TimeType). A `DateFunction` is just a function, usually anonymous, that takes a single [`TimeType`](/stdlib/Dates#Dates.TimeType) as input and returns a [`Bool`](/base/numbers#Core.Bool), `true` indicating a satisfied adjustment criterion. For example:

```julia
julia> istuesday = x->Dates.dayofweek(x) == Dates.Tuesday; # Returns true if the day of the week of x is Tuesday

julia> Dates.tonext(istuesday, Date(2014,7,13)) # 2014-07-13 is a Sunday
2014-07-15

julia> Dates.tonext(Date(2014,7,13), Dates.Tuesday) # Convenience method provided for day of the week adjustments
2014-07-15
```


This is useful with the do-block syntax for more complex temporal expressions:

```julia
julia> Dates.tonext(Date(2014,7,13)) do x
           # Return true on the 4th Thursday of November (Thanksgiving)
           Dates.dayofweek(x) == Dates.Thursday &&
           Dates.dayofweekofmonth(x) == 4 &&
           Dates.month(x) == Dates.November
       end
2014-11-27
```


The [`Base.filter`](/base/collections#Base.filter) method can be used to obtain all valid dates/moments in a specified range:

```julia
# Pittsburgh street cleaning; Every 2nd Tuesday from April to November
# Date range from January 1st, 2014 to January 1st, 2015
julia> dr = Dates.Date(2014):Day(1):Dates.Date(2015);

julia> filter(dr) do x
           Dates.dayofweek(x) == Dates.Tue &&
           Dates.April <= Dates.month(x) <= Dates.Nov &&
           Dates.dayofweekofmonth(x) == 2
       end
8-element Vector{Date}:
 2014-04-08
 2014-05-13
 2014-06-10
 2014-07-08
 2014-08-12
 2014-09-09
 2014-10-14
 2014-11-11
```


Additional examples and tests are available in [`stdlib/Dates/test/adjusters.jl`](https://github.com/JuliaLang/julia/blob/master/stdlib/Dates/test/adjusters.jl).

## Period Types {#Period-Types}

Periods are a human view of discrete, sometimes irregular durations of time. Consider 1 month; it could represent, in days, a value of 28, 29, 30, or 31 depending on the year and month context. Or a year could represent 365 or 366 days in the case of a leap year. [`Period`](/stdlib/Dates#Dates.Period) types are simple [`Int64`](/base/numbers#Core.Int64) wrappers and are constructed by wrapping any `Int64` convertible type, i.e. `Year(1)` or `Month(3.0)`. Arithmetic between [`Period`](/stdlib/Dates#Dates.Period) of the same type behave like integers, and limited `Period-Real` arithmetic is available.  You can extract the underlying integer with [`Dates.value`](/stdlib/Dates#Dates.value).

```julia
julia> y1 = Dates.Year(1)
1 year

julia> y2 = Dates.Year(2)
2 years

julia> y3 = Dates.Year(10)
10 years

julia> y1 + y2
3 years

julia> div(y3,y2)
5

julia> y3 - y2
8 years

julia> y3 % y2
0 years

julia> div(y3,3) # mirrors integer division
3 years

julia> Dates.value(Dates.Millisecond(10))
10
```


Representing periods or durations that are not integer multiples of the basic types can be achieved with the [`Dates.CompoundPeriod`](/stdlib/Dates#Dates.CompoundPeriod) type. Compound periods may be constructed manually from simple [`Period`](/stdlib/Dates#Dates.Period) types. Additionally, the [`canonicalize`](/stdlib/Dates#Dates.canonicalize) function can be used to break down a period into a [`Dates.CompoundPeriod`](/stdlib/Dates#Dates.CompoundPeriod). This is particularly useful to convert a duration, e.g., a difference of two `DateTime`, into a more convenient representation.

```julia
julia> cp = Dates.CompoundPeriod(Day(1),Minute(1))
1 day, 1 minute

julia> t1 = DateTime(2018,8,8,16,58,00)
2018-08-08T16:58:00

julia> t2 = DateTime(2021,6,23,10,00,00)
2021-06-23T10:00:00

julia> canonicalize(t2-t1) # creates a CompoundPeriod
149 weeks, 6 days, 17 hours, 2 minutes
```


## Rounding {#Rounding}

[`Date`](/stdlib/Dates#Dates.Date) and [`DateTime`](/stdlib/Dates#Dates.DateTime) values can be rounded to a specified resolution (e.g., 1 month or 15 minutes) with [`floor`](/base/math#Base.floor), [`ceil`](/base/math#Base.ceil), or [`round`](/base/math#Base.round):

```julia
julia> floor(Date(1985, 8, 16), Dates.Month)
1985-08-01

julia> ceil(DateTime(2013, 2, 13, 0, 31, 20), Dates.Minute(15))
2013-02-13T00:45:00

julia> round(DateTime(2016, 8, 6, 20, 15), Dates.Day)
2016-08-07T00:00:00
```


Unlike the numeric [`round`](/base/math#Base.round) method, which breaks ties toward the even number by default, the [`TimeType`](/stdlib/Dates#Dates.TimeType)[`round`](/base/math#Base.round) method uses the `RoundNearestTiesUp` rounding mode. (It&#39;s difficult to guess what breaking ties to nearest &quot;even&quot; [`TimeType`](/stdlib/Dates#Dates.TimeType) would entail.) Further details on the available `RoundingMode` s can be found in the [API reference](/stdlib/Dates#stdlib-dates-api).

Rounding should generally behave as expected, but there are a few cases in which the expected behaviour is not obvious.

### Rounding Epoch {#Rounding-Epoch}

In many cases, the resolution specified for rounding (e.g., `Dates.Second(30)`) divides evenly into the next largest period (in this case, `Dates.Minute(1)`). But rounding behaviour in cases in which this is not true may lead to confusion. What is the expected result of rounding a [`DateTime`](/stdlib/Dates#Dates.DateTime) to the nearest 10 hours?

```julia
julia> round(DateTime(2016, 7, 17, 11, 55), Dates.Hour(10))
2016-07-17T12:00:00
```


That may seem confusing, given that the hour (12) is not divisible by 10. The reason that `2016-07-17T12:00:00` was chosen is that it is 17,676,660 hours after `0000-01-01T00:00:00`, and 17,676,660 is divisible by 10.

As Julia [`Date`](/stdlib/Dates#Dates.Date) and [`DateTime`](/stdlib/Dates#Dates.DateTime) values are represented according to the ISO 8601 standard, `0000-01-01T00:00:00` was chosen as base (or &quot;rounding epoch&quot;) from which to begin the count of days (and milliseconds) used in rounding calculations. (Note that this differs slightly from Julia&#39;s internal representation of [`Date`](/stdlib/Dates#Dates.Date) s using [Rata Die notation](https://en.wikipedia.org/wiki/Rata_Die); but since the ISO 8601 standard is most visible to the end user, `0000-01-01T00:00:00` was chosen as the rounding epoch instead of the `0000-12-31T00:00:00` used internally to minimize confusion.)

The only exception to the use of `0000-01-01T00:00:00` as the rounding epoch is when rounding to weeks. Rounding to the nearest week will always return a Monday (the first day of the week as specified by ISO 8601). For this reason, we use `0000-01-03T00:00:00` (the first day of the first week of year 0000, as defined by ISO 8601) as the base when rounding to a number of weeks.

Here is a related case in which the expected behaviour is not necessarily obvious: What happens when we round to the nearest `P(2)`, where `P` is a [`Period`](/stdlib/Dates#Dates.Period) type? In some cases (specifically, when `P <: Dates.TimePeriod`) the answer is clear:

```julia
julia> round(DateTime(2016, 7, 17, 8, 55, 30), Dates.Hour(2))
2016-07-17T08:00:00

julia> round(DateTime(2016, 7, 17, 8, 55, 30), Dates.Minute(2))
2016-07-17T08:56:00
```


This seems obvious, because two of each of these periods still divides evenly into the next larger order period. But in the case of two months (which still divides evenly into one year), the answer may be surprising:

```julia
julia> round(DateTime(2016, 7, 17, 8, 55, 30), Dates.Month(2))
2016-07-01T00:00:00
```


Why round to the first day in July, even though it is month 7 (an odd number)? The key is that months are 1-indexed (the first month is assigned 1), unlike hours, minutes, seconds, and milliseconds (the first of which are assigned 0).

This means that rounding a [`DateTime`](/stdlib/Dates#Dates.DateTime) to an even multiple of seconds, minutes, hours, or years (because the ISO 8601 specification includes a year zero) will result in a [`DateTime`](/stdlib/Dates#Dates.DateTime) with an even value in that field, while rounding a [`DateTime`](/stdlib/Dates#Dates.DateTime) to an even multiple of months will result in the months field having an odd value. Because both months and years may contain an irregular number of days, whether rounding to an even number of days will result in an even value in the days field is uncertain.

See the [API reference](/stdlib/Dates#stdlib-dates-api) for additional information on methods exported from the `Dates` module.

# API reference {#stdlib-dates-api}

## Dates and Time Types {#Dates-and-Time-Types}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Period' href='#Dates.Period'>#</a>&nbsp;<b><u>Dates.Period</u></b> &mdash; <i>Type</i>.




```julia
Period
Year
Quarter
Month
Week
Day
Hour
Minute
Second
Millisecond
Microsecond
Nanosecond
```


`Period` types represent discrete, human representations of time.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/types.jl#L5-L20)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.CompoundPeriod' href='#Dates.CompoundPeriod'>#</a>&nbsp;<b><u>Dates.CompoundPeriod</u></b> &mdash; <i>Type</i>.




```julia
CompoundPeriod
```


A `CompoundPeriod` is useful for expressing time periods that are not a fixed multiple of smaller periods. For example, &quot;a year and a  day&quot; is not a fixed number of days, but can be expressed using a `CompoundPeriod`. In fact, a `CompoundPeriod` is automatically generated by addition of different period types, e.g. `Year(1) + Day(1)` produces a `CompoundPeriod` result.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/periods.jl#L121-L129)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Instant' href='#Dates.Instant'>#</a>&nbsp;<b><u>Dates.Instant</u></b> &mdash; <i>Type</i>.




```julia
Instant
```


`Instant` types represent integer-based, machine representations of time as continuous timelines starting from an epoch.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/types.jl#L83-L88)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.UTInstant' href='#Dates.UTInstant'>#</a>&nbsp;<b><u>Dates.UTInstant</u></b> &mdash; <i>Type</i>.




```julia
UTInstant{T}
```


The `UTInstant` represents a machine timeline based on UT time (1 day = one revolution of the earth). The `T` is a `Period` parameter that indicates the resolution or precision of the instant.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/types.jl#L91-L97)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.TimeType' href='#Dates.TimeType'>#</a>&nbsp;<b><u>Dates.TimeType</u></b> &mdash; <i>Type</i>.




```julia
TimeType
```


`TimeType` types wrap `Instant` machine instances to provide human representations of the machine instant. `Time`, `DateTime` and `Date` are subtypes of `TimeType`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/types.jl#L132-L137)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.DateTime' href='#Dates.DateTime'>#</a>&nbsp;<b><u>Dates.DateTime</u></b> &mdash; <i>Type</i>.




```julia
DateTime
```


`DateTime` represents a point in time according to the proleptic Gregorian calendar. The finest resolution of the time is millisecond (i.e., microseconds or nanoseconds cannot be represented by this type). The type supports fixed-point arithmetic, and thus is prone to underflowing (and overflowing). A notable consequence is rounding when adding a `Microsecond` or a `Nanosecond`:

```julia
julia> dt = DateTime(2023, 8, 19, 17, 45, 32, 900)
2023-08-19T17:45:32.900

julia> dt + Millisecond(1)
2023-08-19T17:45:32.901

julia> dt + Microsecond(1000) # 1000us == 1ms
2023-08-19T17:45:32.901

julia> dt + Microsecond(999) # 999us rounded to 1000us
2023-08-19T17:45:32.901

julia> dt + Microsecond(1499) # 1499 rounded to 1000us
2023-08-19T17:45:32.901
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/types.jl#L142-L167)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Date' href='#Dates.Date'>#</a>&nbsp;<b><u>Dates.Date</u></b> &mdash; <i>Type</i>.




```julia
Date
```


`Date` wraps a `UTInstant{Day}` and interprets it according to the proleptic Gregorian calendar.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/types.jl#L173-L177)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Time' href='#Dates.Time'>#</a>&nbsp;<b><u>Dates.Time</u></b> &mdash; <i>Type</i>.




```julia
Time
```


`Time` wraps a `Nanosecond` and represents a specific moment in a 24-hour day.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/types.jl#L183-L187)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.TimeZone' href='#Dates.TimeZone'>#</a>&nbsp;<b><u>Dates.TimeZone</u></b> &mdash; <i>Type</i>.




```julia
TimeZone
```


Geographic zone generally based on longitude determining what the time is at a certain location. Some time zones observe daylight savings (eg EST -&gt; EDT). For implementations and more support, see the [`TimeZones.jl`](https://github.com/JuliaTime/TimeZones.jl) package


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/types.jl#L115-L121)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.UTC' href='#Dates.UTC'>#</a>&nbsp;<b><u>Dates.UTC</u></b> &mdash; <i>Type</i>.




```julia
UTC
```


`UTC`, or Coordinated Universal Time, is the [`TimeZone`](/stdlib/Dates#Dates.TimeZone) from which all others are measured. It is associated with the time at 0° longitude. It is not adjusted for daylight savings.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/types.jl#L124-L129)

</div>
<br>

## Dates Functions {#Dates-Functions}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.DateTime-NTuple{7, Int64}' href='#Dates.DateTime-NTuple{7, Int64}'>#</a>&nbsp;<b><u>Dates.DateTime</u></b> &mdash; <i>Method</i>.




```julia
DateTime(y, [m, d, h, mi, s, ms]) -> DateTime
```


Construct a `DateTime` type by parts. Arguments must be convertible to [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/types.jl#L238-L242)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.DateTime-Tuple{Period}' href='#Dates.DateTime-Tuple{Period}'>#</a>&nbsp;<b><u>Dates.DateTime</u></b> &mdash; <i>Method</i>.




```julia
DateTime(periods::Period...) -> DateTime
```


Construct a `DateTime` type by `Period` type parts. Arguments may be in any order. DateTime parts not provided will default to the value of `Dates.default(period)`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/types.jl#L335-L340)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.DateTime-Tuple{Function, Vararg{Any}}' href='#Dates.DateTime-Tuple{Function, Vararg{Any}}'>#</a>&nbsp;<b><u>Dates.DateTime</u></b> &mdash; <i>Method</i>.




```julia
DateTime(f::Function, y[, m, d, h, mi, s]; step=Day(1), limit=10000) -> DateTime
```


Create a `DateTime` through the adjuster API. The starting point will be constructed from the provided `y, m, d...` arguments, and will be adjusted until `f::Function` returns `true`. The step size in adjusting can be provided manually through the `step` keyword. `limit` provides a limit to the max number of iterations the adjustment API will pursue before throwing an error (in the case that `f::Function` is never satisfied).

**Examples**

```julia
julia> DateTime(dt -> second(dt) == 40, 2010, 10, 20, 10; step = Second(1))
2010-10-20T10:00:40

julia> DateTime(dt -> hour(dt) == 20, 2010, 10, 20, 10; step = Hour(1), limit = 5)
ERROR: ArgumentError: Adjustment limit reached: 5 iterations
Stacktrace:
[...]
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/adjusters.jl#L275-L294)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.DateTime-Tuple{TimeType}' href='#Dates.DateTime-Tuple{TimeType}'>#</a>&nbsp;<b><u>Dates.DateTime</u></b> &mdash; <i>Method</i>.




```julia
DateTime(dt::Date) -> DateTime
```


Convert a `Date` to a `DateTime`. The hour, minute, second, and millisecond parts of the new `DateTime` are assumed to be zero.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/conversions.jl#L14-L19)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.DateTime-Tuple{AbstractString, AbstractString}' href='#Dates.DateTime-Tuple{AbstractString, AbstractString}'>#</a>&nbsp;<b><u>Dates.DateTime</u></b> &mdash; <i>Method</i>.




```julia
DateTime(dt::AbstractString, format::AbstractString; locale="english") -> DateTime
```


Construct a `DateTime` by parsing the `dt` date time string following the pattern given in the `format` string (see [`DateFormat`](/stdlib/Dates#Dates.DateFormat)  for syntax).

::: tip Note

This method creates a `DateFormat` object each time it is called. It is recommended that you create a [`DateFormat`](/stdlib/Dates#Dates.DateFormat) object instead and use that as the second argument to avoid performance loss when using the same format repeatedly.

:::

**Examples**

```julia
julia> DateTime("2020-01-01", "yyyy-mm-dd")
2020-01-01T00:00:00

julia> a = ("2020-01-01", "2020-01-02");

julia> [DateTime(d, dateformat"yyyy-mm-dd") for d ∈ a] # preferred
2-element Vector{DateTime}:
 2020-01-01T00:00:00
 2020-01-02T00:00:00
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/io.jl#L530-L553)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.format-Tuple{TimeType, AbstractString}' href='#Dates.format-Tuple{TimeType, AbstractString}'>#</a>&nbsp;<b><u>Dates.format</u></b> &mdash; <i>Method</i>.




```julia
format(dt::TimeType, format::AbstractString; locale="english") -> AbstractString
```


Construct a string by using a `TimeType` object and applying the provided `format`. The following character codes can be used to construct the `format` string:

| Code | Examples | Comment                                                   |
|:---- |:-------- |:--------------------------------------------------------- |
| `y`  | 6        | Numeric year with a fixed width                           |
| `Y`  | 1996     | Numeric year with a minimum width                         |
| `m`  | 1, 12    | Numeric month with a minimum width                        |
| `u`  | Jan      | Month name shortened to 3-chars according to the `locale` |
| `U`  | January  | Full month name according to the `locale` keyword         |
| `d`  | 1, 31    | Day of the month with a minimum width                     |
| `H`  | 0, 23    | Hour (24-hour clock) with a minimum width                 |
| `M`  | 0, 59    | Minute with a minimum width                               |
| `S`  | 0, 59    | Second with a minimum width                               |
| `s`  | 000, 500 | Millisecond with a minimum width of 3                     |
| `e`  | Mon, Tue | Abbreviated days of the week                              |
| `E`  | Monday   | Full day of week name                                     |


The number of sequential code characters indicate the width of the code. A format of `yyyy-mm` specifies that the code `y` should have a width of four while `m` a width of two. Codes that yield numeric digits have an associated mode: fixed-width or minimum-width. The fixed-width mode left-pads the value with zeros when it is shorter than the specified width and truncates the value when longer. Minimum-width mode works the same as fixed-width except that it does not truncate values longer than the width.

When creating a `format` you can use any non-code characters as a separator. For example to generate the string &quot;1996-01-15T00:00:00&quot; you could use `format`: &quot;yyyy-mm-ddTHH:MM:SS&quot;. Note that if you need to use a code character as a literal you can use the escape character backslash. The string &quot;1996y01m&quot; can be produced with the format &quot;yyyy\ymm\m&quot;.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/io.jl#L667-L699)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.DateFormat' href='#Dates.DateFormat'>#</a>&nbsp;<b><u>Dates.DateFormat</u></b> &mdash; <i>Type</i>.




```julia
DateFormat(format::AbstractString, locale="english") -> DateFormat
```


Construct a date formatting object that can be used for parsing date strings or formatting a date object as a string. The following character codes can be used to construct the `format` string:

| Code       | Matches   | Comment                                                       |
|:---------- |:--------- |:------------------------------------------------------------- |
| `Y`        | 1996, 96  | Returns year of 1996, 0096                                    |
| `y`        | 1996, 96  | Same as `Y` on `parse` but discards excess digits on `format` |
| `m`        | 1, 01     | Matches 1 or 2-digit months                                   |
| `u`        | Jan       | Matches abbreviated months according to the `locale` keyword  |
| `U`        | January   | Matches full month names according to the `locale` keyword    |
| `d`        | 1, 01     | Matches 1 or 2-digit days                                     |
| `H`        | 00        | Matches hours (24-hour clock)                                 |
| `I`        | 00        | For outputting hours with 12-hour clock                       |
| `M`        | 00        | Matches minutes                                               |
| `S`        | 00        | Matches seconds                                               |
| `s`        | .500      | Matches milliseconds                                          |
| `e`        | Mon, Tues | Matches abbreviated days of the week                          |
| `E`        | Monday    | Matches full name days of the week                            |
| `p`        | AM        | Matches AM/PM (case-insensitive)                              |
| `yyyymmdd` | 19960101  | Matches fixed-width year, month, and day                      |


Characters not listed above are normally treated as delimiters between date and time slots. For example a `dt` string of &quot;1996-01-15T00:00:00.0&quot; would have a `format` string like &quot;y-m-dTH:M:S.s&quot;. If you need to use a code character as a delimiter you can escape it using backslash. The date &quot;1995y01m&quot; would have the format &quot;y\ym\m&quot;.

Note that 12:00AM corresponds 00:00 (midnight), and 12:00PM corresponds to 12:00 (noon). When parsing a time with a `p` specifier, any hour (either `H` or `I`) is interpreted as as a 12-hour clock, so the `I` code is mainly useful for output.

Creating a DateFormat object is expensive. Whenever possible, create it once and use it many times or try the [`dateformat""`](/stdlib/Dates#Dates.@dateformat_str) string macro. Using this macro creates the DateFormat object once at macro expansion time and reuses it later. There are also several [pre-defined formatters](/stdlib/Dates#Common-Date-Formatters), listed later.

See [`DateTime`](/stdlib/Dates#Dates.DateTime) and [`format`](/stdlib/Dates#Dates.format-Tuple{TimeType,%20AbstractString}) for how to use a DateFormat object to parse and write Date strings respectively.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/io.jl#L352-L393)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.@dateformat_str' href='#Dates.@dateformat_str'>#</a>&nbsp;<b><u>Dates.@dateformat_str</u></b> &mdash; <i>Macro</i>.




```julia
dateformat"Y-m-d H:M:S"
```


Create a [`DateFormat`](/stdlib/Dates#Dates.DateFormat) object. Similar to `DateFormat("Y-m-d H:M:S")` but creates the DateFormat object once during macro expansion.

See [`DateFormat`](/stdlib/Dates#Dates.DateFormat) for details about format specifiers.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/io.jl#L455-L462)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.DateTime-Tuple{AbstractString, DateFormat}' href='#Dates.DateTime-Tuple{AbstractString, DateFormat}'>#</a>&nbsp;<b><u>Dates.DateTime</u></b> &mdash; <i>Method</i>.




```julia
DateTime(dt::AbstractString, df::DateFormat=ISODateTimeFormat) -> DateTime
```


Construct a `DateTime` by parsing the `dt` date time string following the pattern given in the [`DateFormat`](/stdlib/Dates#Dates.DateFormat) object, or dateformat&quot;yyyy-mm-dd\THH:MM:SS.s&quot; if omitted.

Similar to `DateTime(::AbstractString, ::AbstractString)` but more efficient when repeatedly parsing similarly formatted date time strings with a pre-created `DateFormat` object.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/io.jl#L558-L567)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Date-Tuple{Int64, Int64, Int64}' href='#Dates.Date-Tuple{Int64, Int64, Int64}'>#</a>&nbsp;<b><u>Dates.Date</u></b> &mdash; <i>Method</i>.




```julia
Date(y, [m, d]) -> Date
```


Construct a `Date` type by parts. Arguments must be convertible to [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/types.jl#L270-L274)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Date-Tuple{Period}' href='#Dates.Date-Tuple{Period}'>#</a>&nbsp;<b><u>Dates.Date</u></b> &mdash; <i>Method</i>.




```julia
Date(period::Period...) -> Date
```


Construct a `Date` type by `Period` type parts. Arguments may be in any order. `Date` parts not provided will default to the value of `Dates.default(period)`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/types.jl#L356-L361)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Date-Tuple{Function, Any, Any, Any}' href='#Dates.Date-Tuple{Function, Any, Any, Any}'>#</a>&nbsp;<b><u>Dates.Date</u></b> &mdash; <i>Method</i>.




```julia
Date(f::Function, y[, m, d]; step=Day(1), limit=10000) -> Date
```


Create a `Date` through the adjuster API. The starting point will be constructed from the provided `y, m, d` arguments, and will be adjusted until `f::Function` returns `true`. The step size in adjusting can be provided manually through the `step` keyword. `limit` provides a limit to the max number of iterations the adjustment API will pursue before throwing an error (given that `f::Function` is never satisfied).

**Examples**

```julia
julia> Date(date -> week(date) == 20, 2010, 01, 01)
2010-05-17

julia> Date(date -> year(date) == 2010, 2000, 01, 01)
2010-01-01

julia> Date(date -> month(date) == 10, 2000, 01, 01; limit = 5)
ERROR: ArgumentError: Adjustment limit reached: 5 iterations
Stacktrace:
[...]
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/adjusters.jl#L248-L270)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Date-Tuple{TimeType}' href='#Dates.Date-Tuple{TimeType}'>#</a>&nbsp;<b><u>Dates.Date</u></b> &mdash; <i>Method</i>.




```julia
Date(dt::DateTime) -> Date
```


Convert a `DateTime` to a `Date`. The hour, minute, second, and millisecond parts of the `DateTime` are truncated, so only the year, month and day parts are used in construction.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/conversions.jl#L5-L11)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Date-Tuple{AbstractString, AbstractString}' href='#Dates.Date-Tuple{AbstractString, AbstractString}'>#</a>&nbsp;<b><u>Dates.Date</u></b> &mdash; <i>Method</i>.




```julia
Date(d::AbstractString, format::AbstractString; locale="english") -> Date
```


Construct a `Date` by parsing the `d` date string following the pattern given in the `format` string (see [`DateFormat`](/stdlib/Dates#Dates.DateFormat) for syntax).

::: tip Note

This method creates a `DateFormat` object each time it is called. It is recommended that you create a [`DateFormat`](/stdlib/Dates#Dates.DateFormat) object instead and use that as the second argument to avoid performance loss when using the same format repeatedly.

:::

**Examples**

```julia
julia> Date("2020-01-01", "yyyy-mm-dd")
2020-01-01

julia> a = ("2020-01-01", "2020-01-02");

julia> [Date(d, dateformat"yyyy-mm-dd") for d ∈ a] # preferred
2-element Vector{Date}:
 2020-01-01
 2020-01-02
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/io.jl#L570-L593)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Date-Tuple{AbstractString, DateFormat}' href='#Dates.Date-Tuple{AbstractString, DateFormat}'>#</a>&nbsp;<b><u>Dates.Date</u></b> &mdash; <i>Method</i>.




```julia
Date(d::AbstractString, df::DateFormat=ISODateFormat) -> Date
```


Construct a `Date` by parsing the `d` date string following the pattern given in the [`DateFormat`](/stdlib/Dates#Dates.DateFormat) object, or dateformat&quot;yyyy-mm-dd&quot; if omitted.

Similar to `Date(::AbstractString, ::AbstractString)` but more efficient when repeatedly parsing similarly formatted date strings with a pre-created `DateFormat` object.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/io.jl#L598-L607)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Time-NTuple{5, Int64}' href='#Dates.Time-NTuple{5, Int64}'>#</a>&nbsp;<b><u>Dates.Time</u></b> &mdash; <i>Method</i>.




```julia
Time(h, [mi, s, ms, us, ns]) -> Time
```


Construct a `Time` type by parts. Arguments must be convertible to [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/types.jl#L289-L293)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Time-Tuple{TimePeriod}' href='#Dates.Time-Tuple{TimePeriod}'>#</a>&nbsp;<b><u>Dates.Time</u></b> &mdash; <i>Method</i>.




```julia
Time(period::TimePeriod...) -> Time
```


Construct a `Time` type by `Period` type parts. Arguments may be in any order. `Time` parts not provided will default to the value of `Dates.default(period)`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/types.jl#L372-L377)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Time-Tuple{Function, Vararg{Any}}' href='#Dates.Time-Tuple{Function, Vararg{Any}}'>#</a>&nbsp;<b><u>Dates.Time</u></b> &mdash; <i>Method</i>.




```julia
Time(f::Function, h, mi=0; step::Period=Second(1), limit::Int=10000)
Time(f::Function, h, mi, s; step::Period=Millisecond(1), limit::Int=10000)
Time(f::Function, h, mi, s, ms; step::Period=Microsecond(1), limit::Int=10000)
Time(f::Function, h, mi, s, ms, us; step::Period=Nanosecond(1), limit::Int=10000)
```


Create a `Time` through the adjuster API. The starting point will be constructed from the provided `h, mi, s, ms, us` arguments, and will be adjusted until `f::Function` returns `true`. The step size in adjusting can be provided manually through the `step` keyword. `limit` provides a limit to the max number of iterations the adjustment API will pursue before throwing an error (in the case that `f::Function` is never satisfied). Note that the default step will adjust to allow for greater precision for the given arguments; i.e. if hour, minute, and second arguments are provided, the default step will be `Millisecond(1)` instead of `Second(1)`.

**Examples**

```julia
julia> Time(t -> minute(t) == 30, 20)
20:30:00

julia> Time(t -> minute(t) == 0, 20)
20:00:00

julia> Time(t -> hour(t) == 10, 3; limit = 5)
ERROR: ArgumentError: Adjustment limit reached: 5 iterations
Stacktrace:
[...]
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/adjusters.jl#L313-L340)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Time-Tuple{DateTime}' href='#Dates.Time-Tuple{DateTime}'>#</a>&nbsp;<b><u>Dates.Time</u></b> &mdash; <i>Method</i>.




```julia
Time(dt::DateTime) -> Time
```


Convert a `DateTime` to a `Time`. The hour, minute, second, and millisecond parts of the `DateTime` are used to create the new `Time`. Microsecond and nanoseconds are zero by default.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/conversions.jl#L22-L27)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Time-Tuple{AbstractString, AbstractString}' href='#Dates.Time-Tuple{AbstractString, AbstractString}'>#</a>&nbsp;<b><u>Dates.Time</u></b> &mdash; <i>Method</i>.




```julia
Time(t::AbstractString, format::AbstractString; locale="english") -> Time
```


Construct a `Time` by parsing the `t` time string following the pattern given in the `format` string (see [`DateFormat`](/stdlib/Dates#Dates.DateFormat) for syntax).

::: tip Note

This method creates a `DateFormat` object each time it is called. It is recommended that you create a [`DateFormat`](/stdlib/Dates#Dates.DateFormat) object instead and use that as the second argument to avoid performance loss when using the same format repeatedly.

:::

**Examples**

```julia
julia> Time("12:34pm", "HH:MMp")
12:34:00

julia> a = ("12:34pm", "2:34am");

julia> [Time(d, dateformat"HH:MMp") for d ∈ a] # preferred
2-element Vector{Time}:
 12:34:00
 02:34:00
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/io.jl#L610-L633)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Time-Tuple{AbstractString, DateFormat}' href='#Dates.Time-Tuple{AbstractString, DateFormat}'>#</a>&nbsp;<b><u>Dates.Time</u></b> &mdash; <i>Method</i>.




```julia
Time(t::AbstractString, df::DateFormat=ISOTimeFormat) -> Time
```


Construct a `Time` by parsing the `t` date time string following the pattern given in the [`DateFormat`](/stdlib/Dates#Dates.DateFormat) object, or dateformat&quot;HH:MM:SS.s&quot; if omitted.

Similar to `Time(::AbstractString, ::AbstractString)` but more efficient when repeatedly parsing similarly formatted time strings with a pre-created `DateFormat` object.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/io.jl#L638-L647)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.now-Tuple{}' href='#Dates.now-Tuple{}'>#</a>&nbsp;<b><u>Dates.now</u></b> &mdash; <i>Method</i>.




```julia
now() -> DateTime
```


Return a `DateTime` corresponding to the user&#39;s system time including the system timezone locale.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/conversions.jl#L62-L67)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.now-Tuple{Type{UTC}}' href='#Dates.now-Tuple{Type{UTC}}'>#</a>&nbsp;<b><u>Dates.now</u></b> &mdash; <i>Method</i>.




```julia
now(::Type{UTC}) -> DateTime
```


Return a `DateTime` corresponding to the user&#39;s system time as UTC/GMT. For other time zones, see the TimeZones.jl package.

**Examples**

```julia
julia> now(UTC)
2023-01-04T10:52:24.864
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/conversions.jl#L81-L92)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.eps-Tuple{Union{Type{Date}, Type{DateTime}, Type{Time}, TimeType}}' href='#Base.eps-Tuple{Union{Type{Date}, Type{DateTime}, Type{Time}, TimeType}}'>#</a>&nbsp;<b><u>Base.eps</u></b> &mdash; <i>Method</i>.




```julia
eps(::Type{DateTime}) -> Millisecond
eps(::Type{Date}) -> Day
eps(::Type{Time}) -> Nanosecond
eps(::TimeType) -> Period
```


Return the smallest unit value supported by the `TimeType`.

**Examples**

```julia
julia> eps(DateTime)
1 millisecond

julia> eps(Date)
1 day

julia> eps(Time)
1 nanosecond
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/types.jl#L430-L449)

</div>
<br>

### Accessor Functions {#Accessor-Functions-2}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.year' href='#Dates.year'>#</a>&nbsp;<b><u>Dates.year</u></b> &mdash; <i>Function</i>.




```julia
year(dt::TimeType) -> Int64
```


The year of a `Date` or `DateTime` as an [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/accessors.jl#L81-L85)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.month' href='#Dates.month'>#</a>&nbsp;<b><u>Dates.month</u></b> &mdash; <i>Function</i>.




```julia
month(dt::TimeType) -> Int64
```


The month of a `Date` or `DateTime` as an [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/accessors.jl#L81-L85)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.week' href='#Dates.week'>#</a>&nbsp;<b><u>Dates.week</u></b> &mdash; <i>Function</i>.




```julia
week(dt::TimeType) -> Int64
```


Return the [ISO week date](https://en.wikipedia.org/wiki/ISO_week_date) of a `Date` or `DateTime` as an [`Int64`](/base/numbers#Core.Int64). Note that the first week of a year is the week that contains the first Thursday of the year, which can result in dates prior to January 4th being in the last week of the previous year. For example, `week(Date(2005, 1, 1))` is the 53rd week of 2004.

**Examples**

```julia
julia> week(Date(1989, 6, 22))
25

julia> week(Date(2005, 1, 1))
53

julia> week(Date(2004, 12, 31))
53
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/accessors.jl#L89-L109)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.day' href='#Dates.day'>#</a>&nbsp;<b><u>Dates.day</u></b> &mdash; <i>Function</i>.




```julia
day(dt::TimeType) -> Int64
```


The day of month of a `Date` or `DateTime` as an [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/accessors.jl#L115-L119)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.hour' href='#Dates.hour'>#</a>&nbsp;<b><u>Dates.hour</u></b> &mdash; <i>Function</i>.




```julia
hour(dt::DateTime) -> Int64
```


The hour of day of a `DateTime` as an [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/accessors.jl#L123-L127)



```julia
hour(t::Time) -> Int64
```


The hour of a `Time` as an [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/accessors.jl#L157-L161)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.minute' href='#Dates.minute'>#</a>&nbsp;<b><u>Dates.minute</u></b> &mdash; <i>Function</i>.




```julia
minute(dt::DateTime) -> Int64
```


The minute of a `DateTime` as an [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/accessors.jl#L133-L137)



```julia
minute(t::Time) -> Int64
```


The minute of a `Time` as an [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/accessors.jl#L157-L161)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.second' href='#Dates.second'>#</a>&nbsp;<b><u>Dates.second</u></b> &mdash; <i>Function</i>.




```julia
second(dt::DateTime) -> Int64
```


The second of a `DateTime` as an [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/accessors.jl#L133-L137)



```julia
second(t::Time) -> Int64
```


The second of a `Time` as an [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/accessors.jl#L157-L161)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.millisecond' href='#Dates.millisecond'>#</a>&nbsp;<b><u>Dates.millisecond</u></b> &mdash; <i>Function</i>.




```julia
millisecond(dt::DateTime) -> Int64
```


The millisecond of a `DateTime` as an [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/accessors.jl#L133-L137)



```julia
millisecond(t::Time) -> Int64
```


The millisecond of a `Time` as an [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/accessors.jl#L157-L161)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.microsecond' href='#Dates.microsecond'>#</a>&nbsp;<b><u>Dates.microsecond</u></b> &mdash; <i>Function</i>.




```julia
microsecond(t::Time) -> Int64
```


The microsecond of a `Time` as an [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/accessors.jl#L157-L161)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.nanosecond' href='#Dates.nanosecond'>#</a>&nbsp;<b><u>Dates.nanosecond</u></b> &mdash; <i>Function</i>.




```julia
nanosecond(t::Time) -> Int64
```


The nanosecond of a `Time` as an [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/accessors.jl#L157-L161)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Year-Tuple{TimeType}' href='#Dates.Year-Tuple{TimeType}'>#</a>&nbsp;<b><u>Dates.Year</u></b> &mdash; <i>Method</i>.




```julia
Year(v)
```


Construct a `Year` object with the given `v` value. Input must be losslessly convertible to an [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/periods.jl#L38-L43)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Month-Tuple{TimeType}' href='#Dates.Month-Tuple{TimeType}'>#</a>&nbsp;<b><u>Dates.Month</u></b> &mdash; <i>Method</i>.




```julia
Month(v)
```


Construct a `Month` object with the given `v` value. Input must be losslessly convertible to an [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/periods.jl#L38-L43)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Week-Tuple{TimeType}' href='#Dates.Week-Tuple{TimeType}'>#</a>&nbsp;<b><u>Dates.Week</u></b> &mdash; <i>Method</i>.




```julia
Week(v)
```


Construct a `Week` object with the given `v` value. Input must be losslessly convertible to an [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/periods.jl#L38-L43)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Day-Tuple{TimeType}' href='#Dates.Day-Tuple{TimeType}'>#</a>&nbsp;<b><u>Dates.Day</u></b> &mdash; <i>Method</i>.




```julia
Day(v)
```


Construct a `Day` object with the given `v` value. Input must be losslessly convertible to an [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/periods.jl#L38-L43)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Hour-Tuple{DateTime}' href='#Dates.Hour-Tuple{DateTime}'>#</a>&nbsp;<b><u>Dates.Hour</u></b> &mdash; <i>Method</i>.




```julia
Hour(dt::DateTime) -> Hour
```


The hour part of a DateTime as a `Hour`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/periods.jl#L30-L34)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Minute-Tuple{DateTime}' href='#Dates.Minute-Tuple{DateTime}'>#</a>&nbsp;<b><u>Dates.Minute</u></b> &mdash; <i>Method</i>.




```julia
Minute(dt::DateTime) -> Minute
```


The minute part of a DateTime as a `Minute`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/periods.jl#L30-L34)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Second-Tuple{DateTime}' href='#Dates.Second-Tuple{DateTime}'>#</a>&nbsp;<b><u>Dates.Second</u></b> &mdash; <i>Method</i>.




```julia
Second(dt::DateTime) -> Second
```


The second part of a DateTime as a `Second`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/periods.jl#L30-L34)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Millisecond-Tuple{DateTime}' href='#Dates.Millisecond-Tuple{DateTime}'>#</a>&nbsp;<b><u>Dates.Millisecond</u></b> &mdash; <i>Method</i>.




```julia
Millisecond(dt::DateTime) -> Millisecond
```


The millisecond part of a DateTime as a `Millisecond`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/periods.jl#L30-L34)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Microsecond-Tuple{Time}' href='#Dates.Microsecond-Tuple{Time}'>#</a>&nbsp;<b><u>Dates.Microsecond</u></b> &mdash; <i>Method</i>.




```julia
Microsecond(dt::Time) -> Microsecond
```


The microsecond part of a Time as a `Microsecond`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/periods.jl#L30-L34)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Nanosecond-Tuple{Time}' href='#Dates.Nanosecond-Tuple{Time}'>#</a>&nbsp;<b><u>Dates.Nanosecond</u></b> &mdash; <i>Method</i>.




```julia
Nanosecond(dt::Time) -> Nanosecond
```


The nanosecond part of a Time as a `Nanosecond`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/periods.jl#L30-L34)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.yearmonth' href='#Dates.yearmonth'>#</a>&nbsp;<b><u>Dates.yearmonth</u></b> &mdash; <i>Function</i>.




```julia
yearmonth(dt::TimeType) -> (Int64, Int64)
```


Simultaneously return the year and month parts of a `Date` or `DateTime`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/accessors.jl#L145-L150)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.monthday' href='#Dates.monthday'>#</a>&nbsp;<b><u>Dates.monthday</u></b> &mdash; <i>Function</i>.




```julia
monthday(dt::TimeType) -> (Int64, Int64)
```


Simultaneously return the month and day parts of a `Date` or `DateTime`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/accessors.jl#L145-L150)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.yearmonthday' href='#Dates.yearmonthday'>#</a>&nbsp;<b><u>Dates.yearmonthday</u></b> &mdash; <i>Function</i>.




```julia
yearmonthday(dt::TimeType) -> (Int64, Int64, Int64)
```


Simultaneously return the year, month and day parts of a `Date` or `DateTime`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/accessors.jl#L145-L150)

</div>
<br>

### Query Functions {#Query-Functions-2}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.dayname' href='#Dates.dayname'>#</a>&nbsp;<b><u>Dates.dayname</u></b> &mdash; <i>Function</i>.




```julia
dayname(dt::TimeType; locale="english") -> String
dayname(day::Integer; locale="english") -> String
```


Return the full day name corresponding to the day of the week of the `Date` or `DateTime` in the given `locale`. Also accepts `Integer`.

**Examples**

```julia
julia> dayname(Date("2000-01-01"))
"Saturday"

julia> dayname(4)
"Thursday"
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/query.jl#L153-L168)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.dayabbr' href='#Dates.dayabbr'>#</a>&nbsp;<b><u>Dates.dayabbr</u></b> &mdash; <i>Function</i>.




```julia
dayabbr(dt::TimeType; locale="english") -> String
dayabbr(day::Integer; locale="english") -> String
```


Return the abbreviated name corresponding to the day of the week of the `Date` or `DateTime` in the given `locale`. Also accepts `Integer`.

**Examples**

```julia
julia> dayabbr(Date("2000-01-01"))
"Sat"

julia> dayabbr(3)
"Wed"
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/query.jl#L173-L188)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.dayofweek' href='#Dates.dayofweek'>#</a>&nbsp;<b><u>Dates.dayofweek</u></b> &mdash; <i>Function</i>.




```julia
dayofweek(dt::TimeType) -> Int64
```


Return the day of the week as an [`Int64`](/base/numbers#Core.Int64) with `1 = Monday, 2 = Tuesday, etc.`.

**Examples**

```julia
julia> dayofweek(Date("2000-01-01"))
6
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/query.jl#L110-L120)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.dayofmonth' href='#Dates.dayofmonth'>#</a>&nbsp;<b><u>Dates.dayofmonth</u></b> &mdash; <i>Function</i>.




```julia
dayofmonth(dt::TimeType) -> Int64
```


The day of month of a `Date` or `DateTime` as an [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/accessors.jl#L115-L119)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.dayofweekofmonth' href='#Dates.dayofweekofmonth'>#</a>&nbsp;<b><u>Dates.dayofweekofmonth</u></b> &mdash; <i>Function</i>.




```julia
dayofweekofmonth(dt::TimeType) -> Int
```


For the day of week of `dt`, return which number it is in `dt`&#39;s month. So if the day of the week of `dt` is Monday, then `1 = First Monday of the month, 2 = Second Monday of the month, etc.` In the range 1:5.

**Examples**

```julia
julia> dayofweekofmonth(Date("2000-02-01"))
1

julia> dayofweekofmonth(Date("2000-02-08"))
2

julia> dayofweekofmonth(Date("2000-02-15"))
3
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/query.jl#L203-L221)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.daysofweekinmonth' href='#Dates.daysofweekinmonth'>#</a>&nbsp;<b><u>Dates.daysofweekinmonth</u></b> &mdash; <i>Function</i>.




```julia
daysofweekinmonth(dt::TimeType) -> Int
```


For the day of week of `dt`, return the total number of that day of the week in `dt`&#39;s month. Returns 4 or 5. Useful in temporal expressions for specifying the last day of a week in a month by including `dayofweekofmonth(dt) == daysofweekinmonth(dt)` in the adjuster function.

**Examples**

```julia
julia> daysofweekinmonth(Date("2005-01-01"))
5

julia> daysofweekinmonth(Date("2005-01-04"))
4
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/query.jl#L233-L249)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.monthname' href='#Dates.monthname'>#</a>&nbsp;<b><u>Dates.monthname</u></b> &mdash; <i>Function</i>.




```julia
monthname(dt::TimeType; locale="english") -> String
monthname(month::Integer, locale="english") -> String
```


Return the full name of the month of the `Date` or `DateTime` or `Integer` in the given `locale`.

**Examples**

```julia
julia> monthname(Date("2005-01-04"))
"January"

julia> monthname(2)
"February"
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/query.jl#L563-L578)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.monthabbr' href='#Dates.monthabbr'>#</a>&nbsp;<b><u>Dates.monthabbr</u></b> &mdash; <i>Function</i>.




```julia
monthabbr(dt::TimeType; locale="english") -> String
monthabbr(month::Integer, locale="english") -> String
```


Return the abbreviated month name of the `Date` or `DateTime` or `Integer` in the given `locale`.

**Examples**

```julia
julia> monthabbr(Date("2005-01-04"))
"Jan"

julia> monthabbr(2)
"Feb"
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/query.jl#L583-L597)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.daysinmonth' href='#Dates.daysinmonth'>#</a>&nbsp;<b><u>Dates.daysinmonth</u></b> &mdash; <i>Function</i>.




```julia
daysinmonth(dt::TimeType) -> Int
```


Return the number of days in the month of `dt`. Value will be 28, 29, 30, or 31.

**Examples**

```julia
julia> daysinmonth(Date("2000-01"))
31

julia> daysinmonth(Date("2001-02"))
28

julia> daysinmonth(Date("2000-02"))
29
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/query.jl#L602-L618)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.isleapyear' href='#Dates.isleapyear'>#</a>&nbsp;<b><u>Dates.isleapyear</u></b> &mdash; <i>Function</i>.




```julia
isleapyear(dt::TimeType) -> Bool
```


Return `true` if the year of `dt` is a leap year.

**Examples**

```julia
julia> isleapyear(Date("2004"))
true

julia> isleapyear(Date("2005"))
false
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/query.jl#L622-L635)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.dayofyear' href='#Dates.dayofyear'>#</a>&nbsp;<b><u>Dates.dayofyear</u></b> &mdash; <i>Function</i>.




```julia
dayofyear(dt::TimeType) -> Int
```


Return the day of the year for `dt` with January 1st being day 1.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/query.jl#L638-L642)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.daysinyear' href='#Dates.daysinyear'>#</a>&nbsp;<b><u>Dates.daysinyear</u></b> &mdash; <i>Function</i>.




```julia
daysinyear(dt::TimeType) -> Int
```


Return 366 if the year of `dt` is a leap year, otherwise return 365.

**Examples**

```julia
julia> daysinyear(1999)
365

julia> daysinyear(2000)
366
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/query.jl#L89-L102)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.quarterofyear' href='#Dates.quarterofyear'>#</a>&nbsp;<b><u>Dates.quarterofyear</u></b> &mdash; <i>Function</i>.




```julia
quarterofyear(dt::TimeType) -> Int
```


Return the quarter that `dt` resides in. Range of value is 1:4.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/query.jl#L648-L652)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.dayofquarter' href='#Dates.dayofquarter'>#</a>&nbsp;<b><u>Dates.dayofquarter</u></b> &mdash; <i>Function</i>.




```julia
dayofquarter(dt::TimeType) -> Int
```


Return the day of the current quarter of `dt`. Range of value is 1:92.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/query.jl#L657-L661)

</div>
<br>

### Adjuster Functions {#Adjuster-Functions-2}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.trunc-Tuple{TimeType, Type{Period}}' href='#Base.trunc-Tuple{TimeType, Type{Period}}'>#</a>&nbsp;<b><u>Base.trunc</u></b> &mdash; <i>Method</i>.




```julia
trunc(dt::TimeType, ::Type{Period}) -> TimeType
```


Truncates the value of `dt` according to the provided `Period` type.

**Examples**

```julia
julia> trunc(DateTime("1996-01-01T12:30:00"), Day)
1996-01-01T00:00:00
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/adjusters.jl#L25-L35)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.firstdayofweek' href='#Dates.firstdayofweek'>#</a>&nbsp;<b><u>Dates.firstdayofweek</u></b> &mdash; <i>Function</i>.




```julia
firstdayofweek(dt::TimeType) -> TimeType
```


Adjusts `dt` to the Monday of its week.

**Examples**

```julia
julia> firstdayofweek(DateTime("1996-01-05T12:30:00"))
1996-01-01T00:00:00
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/adjusters.jl#L39-L49)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.lastdayofweek' href='#Dates.lastdayofweek'>#</a>&nbsp;<b><u>Dates.lastdayofweek</u></b> &mdash; <i>Function</i>.




```julia
lastdayofweek(dt::TimeType) -> TimeType
```


Adjusts `dt` to the Sunday of its week.

**Examples**

```julia
julia> lastdayofweek(DateTime("1996-01-05T12:30:00"))
1996-01-07T00:00:00
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/adjusters.jl#L55-L65)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.firstdayofmonth' href='#Dates.firstdayofmonth'>#</a>&nbsp;<b><u>Dates.firstdayofmonth</u></b> &mdash; <i>Function</i>.




```julia
firstdayofmonth(dt::TimeType) -> TimeType
```


Adjusts `dt` to the first day of its month.

**Examples**

```julia
julia> firstdayofmonth(DateTime("1996-05-20"))
1996-05-01T00:00:00
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/adjusters.jl#L71-L81)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.lastdayofmonth' href='#Dates.lastdayofmonth'>#</a>&nbsp;<b><u>Dates.lastdayofmonth</u></b> &mdash; <i>Function</i>.




```julia
lastdayofmonth(dt::TimeType) -> TimeType
```


Adjusts `dt` to the last day of its month.

**Examples**

```julia
julia> lastdayofmonth(DateTime("1996-05-20"))
1996-05-31T00:00:00
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/adjusters.jl#L87-L97)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.firstdayofyear' href='#Dates.firstdayofyear'>#</a>&nbsp;<b><u>Dates.firstdayofyear</u></b> &mdash; <i>Function</i>.




```julia
firstdayofyear(dt::TimeType) -> TimeType
```


Adjusts `dt` to the first day of its year.

**Examples**

```julia
julia> firstdayofyear(DateTime("1996-05-20"))
1996-01-01T00:00:00
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/adjusters.jl#L106-L116)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.lastdayofyear' href='#Dates.lastdayofyear'>#</a>&nbsp;<b><u>Dates.lastdayofyear</u></b> &mdash; <i>Function</i>.




```julia
lastdayofyear(dt::TimeType) -> TimeType
```


Adjusts `dt` to the last day of its year.

**Examples**

```julia
julia> lastdayofyear(DateTime("1996-05-20"))
1996-12-31T00:00:00
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/adjusters.jl#L122-L132)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.firstdayofquarter' href='#Dates.firstdayofquarter'>#</a>&nbsp;<b><u>Dates.firstdayofquarter</u></b> &mdash; <i>Function</i>.




```julia
firstdayofquarter(dt::TimeType) -> TimeType
```


Adjusts `dt` to the first day of its quarter.

**Examples**

```julia
julia> firstdayofquarter(DateTime("1996-05-20"))
1996-04-01T00:00:00

julia> firstdayofquarter(DateTime("1996-08-20"))
1996-07-01T00:00:00
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/adjusters.jl#L141-L154)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.lastdayofquarter' href='#Dates.lastdayofquarter'>#</a>&nbsp;<b><u>Dates.lastdayofquarter</u></b> &mdash; <i>Function</i>.




```julia
lastdayofquarter(dt::TimeType) -> TimeType
```


Adjusts `dt` to the last day of its quarter.

**Examples**

```julia
julia> lastdayofquarter(DateTime("1996-05-20"))
1996-06-30T00:00:00

julia> lastdayofquarter(DateTime("1996-08-20"))
1996-09-30T00:00:00
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/adjusters.jl#L164-L177)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.tonext-Tuple{TimeType, Int64}' href='#Dates.tonext-Tuple{TimeType, Int64}'>#</a>&nbsp;<b><u>Dates.tonext</u></b> &mdash; <i>Method</i>.




```julia
tonext(dt::TimeType, dow::Int; same::Bool=false) -> TimeType
```


Adjusts `dt` to the next day of week corresponding to `dow` with `1 = Monday, 2 = Tuesday, etc`. Setting `same=true` allows the current `dt` to be considered as the next `dow`, allowing for no adjustment to occur.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/adjusters.jl#L366-L372)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.toprev-Tuple{TimeType, Int64}' href='#Dates.toprev-Tuple{TimeType, Int64}'>#</a>&nbsp;<b><u>Dates.toprev</u></b> &mdash; <i>Method</i>.




```julia
toprev(dt::TimeType, dow::Int; same::Bool=false) -> TimeType
```


Adjusts `dt` to the previous day of week corresponding to `dow` with `1 = Monday, 2 = Tuesday, etc`. Setting `same=true` allows the current `dt` to be considered as the previous `dow`, allowing for no adjustment to occur.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/adjusters.jl#L387-L393)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.tofirst' href='#Dates.tofirst'>#</a>&nbsp;<b><u>Dates.tofirst</u></b> &mdash; <i>Function</i>.




```julia
tofirst(dt::TimeType, dow::Int; of=Month) -> TimeType
```


Adjusts `dt` to the first `dow` of its month. Alternatively, `of=Year` will adjust to the first `dow` of the year.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/adjusters.jl#L408-L413)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.tolast' href='#Dates.tolast'>#</a>&nbsp;<b><u>Dates.tolast</u></b> &mdash; <i>Function</i>.




```julia
tolast(dt::TimeType, dow::Int; of=Month) -> TimeType
```


Adjusts `dt` to the last `dow` of its month. Alternatively, `of=Year` will adjust to the last `dow` of the year.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/adjusters.jl#L420-L425)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.tonext-Tuple{Function, TimeType}' href='#Dates.tonext-Tuple{Function, TimeType}'>#</a>&nbsp;<b><u>Dates.tonext</u></b> &mdash; <i>Method</i>.




```julia
tonext(func::Function, dt::TimeType; step=Day(1), limit=10000, same=false) -> TimeType
```


Adjusts `dt` by iterating at most `limit` iterations by `step` increments until `func` returns `true`. `func` must take a single `TimeType` argument and return a [`Bool`](/base/numbers#Core.Bool). `same` allows `dt` to be considered in satisfying `func`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/adjusters.jl#L376-L382)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.toprev-Tuple{Function, TimeType}' href='#Dates.toprev-Tuple{Function, TimeType}'>#</a>&nbsp;<b><u>Dates.toprev</u></b> &mdash; <i>Method</i>.




```julia
toprev(func::Function, dt::TimeType; step=Day(-1), limit=10000, same=false) -> TimeType
```


Adjusts `dt` by iterating at most `limit` iterations by `step` increments until `func` returns `true`. `func` must take a single `TimeType` argument and return a [`Bool`](/base/numbers#Core.Bool). `same` allows `dt` to be considered in satisfying `func`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/adjusters.jl#L396-L402)

</div>
<br>

### Periods {#Periods}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.Period-Tuple{Any}' href='#Dates.Period-Tuple{Any}'>#</a>&nbsp;<b><u>Dates.Period</u></b> &mdash; <i>Method</i>.




```julia
Year(v)
Quarter(v)
Month(v)
Week(v)
Day(v)
Hour(v)
Minute(v)
Second(v)
Millisecond(v)
Microsecond(v)
Nanosecond(v)
```


Construct a `Period` type with the given `v` value. Input must be losslessly convertible to an [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/types.jl#L65-L80)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.CompoundPeriod-Tuple{Vector{<:Period}}' href='#Dates.CompoundPeriod-Tuple{Vector{<:Period}}'>#</a>&nbsp;<b><u>Dates.CompoundPeriod</u></b> &mdash; <i>Method</i>.




```julia
CompoundPeriod(periods) -> CompoundPeriod
```


Construct a `CompoundPeriod` from a `Vector` of `Period`s. All `Period`s of the same type will be added together.

**Examples**

```julia
julia> Dates.CompoundPeriod(Dates.Hour(12), Dates.Hour(13))
25 hours

julia> Dates.CompoundPeriod(Dates.Hour(-1), Dates.Minute(1))
-1 hour, 1 minute

julia> Dates.CompoundPeriod(Dates.Month(1), Dates.Week(-2))
1 month, -2 weeks

julia> Dates.CompoundPeriod(Dates.Minute(50000))
50000 minutes
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/periods.jl#L177-L197)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.canonicalize' href='#Dates.canonicalize'>#</a>&nbsp;<b><u>Dates.canonicalize</u></b> &mdash; <i>Function</i>.




```julia
canonicalize(::CompoundPeriod) -> CompoundPeriod
```


Reduces the `CompoundPeriod` into its canonical form by applying the following rules:
- Any `Period` large enough be partially representable by a coarser `Period` will be broken into multiple `Period`s (eg. `Hour(30)` becomes `Day(1) + Hour(6)`)
  
- `Period`s with opposite signs will be combined when possible (eg. `Hour(1) - Day(1)` becomes `-Hour(23)`)
  

**Examples**

```julia
julia> canonicalize(Dates.CompoundPeriod(Dates.Hour(12), Dates.Hour(13)))
1 day, 1 hour

julia> canonicalize(Dates.CompoundPeriod(Dates.Hour(-1), Dates.Minute(1)))
-59 minutes

julia> canonicalize(Dates.CompoundPeriod(Dates.Month(1), Dates.Week(-2)))
1 month, -2 weeks

julia> canonicalize(Dates.CompoundPeriod(Dates.Minute(50000)))
4 weeks, 6 days, 17 hours, 20 minutes
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/periods.jl#L206-L230)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.value' href='#Dates.value'>#</a>&nbsp;<b><u>Dates.value</u></b> &mdash; <i>Function</i>.




```julia
Dates.value(x::Period) -> Int64
```


For a given period, return the value associated with that period.  For example, `value(Millisecond(10))` returns 10 as an integer.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/periods.jl#L4-L9)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.default' href='#Dates.default'>#</a>&nbsp;<b><u>Dates.default</u></b> &mdash; <i>Function</i>.




```julia
default(p::Period) -> Period
```


Return a sensible &quot;default&quot; value for the input Period by returning `T(1)` for Year, Month, and Day, and `T(0)` for Hour, Minute, Second, and Millisecond.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/periods.jl#L58-L63)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.periods' href='#Dates.periods'>#</a>&nbsp;<b><u>Dates.periods</u></b> &mdash; <i>Function</i>.




```julia
Dates.periods(::CompoundPeriod) -> Vector{Period}
```


Return the `Vector` of `Period`s that comprise the given `CompoundPeriod`.

::: tip Julia 1.7

This function requires Julia 1.7 or later.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/periods.jl#L167-L174)

</div>
<br>

### Rounding Functions {#Rounding-Functions}

`Date` and `DateTime` values can be rounded to a specified resolution (e.g., 1 month or 15 minutes) with `floor`, `ceil`, or `round`.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.floor-Tuple{TimeType, Period}' href='#Base.floor-Tuple{TimeType, Period}'>#</a>&nbsp;<b><u>Base.floor</u></b> &mdash; <i>Method</i>.




```julia
floor(dt::TimeType, p::Period) -> TimeType
```


Return the nearest `Date` or `DateTime` less than or equal to `dt` at resolution `p`.

For convenience, `p` may be a type instead of a value: `floor(dt, Dates.Hour)` is a shortcut for `floor(dt, Dates.Hour(1))`.

```julia
julia> floor(Date(1985, 8, 16), Month)
1985-08-01

julia> floor(DateTime(2013, 2, 13, 0, 31, 20), Minute(15))
2013-02-13T00:30:00

julia> floor(DateTime(2016, 8, 6, 12, 0, 0), Day)
2016-08-06T00:00:00
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/rounding.jl#L116-L134)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ceil-Tuple{TimeType, Period}' href='#Base.ceil-Tuple{TimeType, Period}'>#</a>&nbsp;<b><u>Base.ceil</u></b> &mdash; <i>Method</i>.




```julia
ceil(dt::TimeType, p::Period) -> TimeType
```


Return the nearest `Date` or `DateTime` greater than or equal to `dt` at resolution `p`.

For convenience, `p` may be a type instead of a value: `ceil(dt, Dates.Hour)` is a shortcut for `ceil(dt, Dates.Hour(1))`.

```julia
julia> ceil(Date(1985, 8, 16), Month)
1985-09-01

julia> ceil(DateTime(2013, 2, 13, 0, 31, 20), Minute(15))
2013-02-13T00:45:00

julia> ceil(DateTime(2016, 8, 6, 12, 0, 0), Day)
2016-08-07T00:00:00
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/rounding.jl#L137-L155)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.round-Tuple{TimeType, Period, RoundingMode{:NearestTiesUp}}' href='#Base.round-Tuple{TimeType, Period, RoundingMode{:NearestTiesUp}}'>#</a>&nbsp;<b><u>Base.round</u></b> &mdash; <i>Method</i>.




```julia
round(dt::TimeType, p::Period, [r::RoundingMode]) -> TimeType
```


Return the `Date` or `DateTime` nearest to `dt` at resolution `p`. By default (`RoundNearestTiesUp`), ties (e.g., rounding 9:30 to the nearest hour) will be rounded up.

For convenience, `p` may be a type instead of a value: `round(dt, Dates.Hour)` is a shortcut for `round(dt, Dates.Hour(1))`.

```julia
julia> round(Date(1985, 8, 16), Month)
1985-08-01

julia> round(DateTime(2013, 2, 13, 0, 31, 20), Minute(15))
2013-02-13T00:30:00

julia> round(DateTime(2016, 8, 6, 12, 0, 0), Day)
2016-08-07T00:00:00
```


Valid rounding modes for `round(::TimeType, ::Period, ::RoundingMode)` are `RoundNearestTiesUp` (default), `RoundDown` (`floor`), and `RoundUp` (`ceil`).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/rounding.jl#L211-L233)

</div>
<br>

Most `Period` values can also be rounded to a specified resolution:
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.floor-Union{Tuple{T}, Tuple{Union{Day, Week, TimePeriod}, T}} where T<:Union{Day, Week, TimePeriod}' href='#Base.floor-Union{Tuple{T}, Tuple{Union{Day, Week, TimePeriod}, T}} where T<:Union{Day, Week, TimePeriod}'>#</a>&nbsp;<b><u>Base.floor</u></b> &mdash; <i>Method</i>.




```julia
floor(x::Period, precision::T) where T <: Union{TimePeriod, Week, Day} -> T
```


Round `x` down to the nearest multiple of `precision`. If `x` and `precision` are different subtypes of `Period`, the return value will have the same type as `precision`.

For convenience, `precision` may be a type instead of a value: `floor(x, Dates.Hour)` is a shortcut for `floor(x, Dates.Hour(1))`.

```julia
julia> floor(Day(16), Week)
2 weeks

julia> floor(Minute(44), Minute(15))
30 minutes

julia> floor(Hour(36), Day)
1 day
```


Rounding to a `precision` of `Month`s or `Year`s is not supported, as these `Period`s are of inconsistent length.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/rounding.jl#L87-L109)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ceil-Tuple{Union{Day, Week, TimePeriod}, Union{Day, Week, TimePeriod}}' href='#Base.ceil-Tuple{Union{Day, Week, TimePeriod}, Union{Day, Week, TimePeriod}}'>#</a>&nbsp;<b><u>Base.ceil</u></b> &mdash; <i>Method</i>.




```julia
ceil(x::Period, precision::T) where T <: Union{TimePeriod, Week, Day} -> T
```


Round `x` up to the nearest multiple of `precision`. If `x` and `precision` are different subtypes of `Period`, the return value will have the same type as `precision`.

For convenience, `precision` may be a type instead of a value: `ceil(x, Dates.Hour)` is a shortcut for `ceil(x, Dates.Hour(1))`.

```julia
julia> ceil(Day(16), Week)
3 weeks

julia> ceil(Minute(44), Minute(15))
45 minutes

julia> ceil(Hour(36), Day)
2 days
```


Rounding to a `precision` of `Month`s or `Year`s is not supported, as these `Period`s are of inconsistent length.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/rounding.jl#L161-L183)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.round-Tuple{Union{Day, Week, TimePeriod}, Union{Day, Week, TimePeriod}, RoundingMode{:NearestTiesUp}}' href='#Base.round-Tuple{Union{Day, Week, TimePeriod}, Union{Day, Week, TimePeriod}, RoundingMode{:NearestTiesUp}}'>#</a>&nbsp;<b><u>Base.round</u></b> &mdash; <i>Method</i>.




```julia
round(x::Period, precision::T, [r::RoundingMode]) where T <: Union{TimePeriod, Week, Day} -> T
```


Round `x` to the nearest multiple of `precision`. If `x` and `precision` are different subtypes of `Period`, the return value will have the same type as `precision`. By default (`RoundNearestTiesUp`), ties (e.g., rounding 90 minutes to the nearest hour) will be rounded up.

For convenience, `precision` may be a type instead of a value: `round(x, Dates.Hour)` is a shortcut for `round(x, Dates.Hour(1))`.

```julia
julia> round(Day(16), Week)
2 weeks

julia> round(Minute(44), Minute(15))
45 minutes

julia> round(Hour(36), Day)
2 days
```


Valid rounding modes for `round(::Period, ::T, ::RoundingMode)` are `RoundNearestTiesUp` (default), `RoundDown` (`floor`), and `RoundUp` (`ceil`).

Rounding to a `precision` of `Month`s or `Year`s is not supported, as these `Period`s are of inconsistent length.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/rounding.jl#L239-L266)

</div>
<br>

The following functions are not exported:
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.floorceil' href='#Dates.floorceil'>#</a>&nbsp;<b><u>Dates.floorceil</u></b> &mdash; <i>Function</i>.




```julia
floorceil(dt::TimeType, p::Period) -> (TimeType, TimeType)
```


Simultaneously return the `floor` and `ceil` of a `Date` or `DateTime` at resolution `p`. More efficient than calling both `floor` and `ceil` individually.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/rounding.jl#L189-L194)



```julia
floorceil(x::Period, precision::T) where T <: Union{TimePeriod, Week, Day} -> (T, T)
```


Simultaneously return the `floor` and `ceil` of `Period` at resolution `p`.  More efficient than calling both `floor` and `ceil` individually.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/rounding.jl#L200-L205)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.epochdays2date' href='#Dates.epochdays2date'>#</a>&nbsp;<b><u>Dates.epochdays2date</u></b> &mdash; <i>Function</i>.




```julia
epochdays2date(days) -> Date
```


Take the number of days since the rounding epoch (`0000-01-01T00:00:00`) and return the corresponding `Date`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/rounding.jl#L13-L18)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.epochms2datetime' href='#Dates.epochms2datetime'>#</a>&nbsp;<b><u>Dates.epochms2datetime</u></b> &mdash; <i>Function</i>.




```julia
epochms2datetime(milliseconds) -> DateTime
```


Take the number of milliseconds since the rounding epoch (`0000-01-01T00:00:00`) and return the corresponding `DateTime`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/rounding.jl#L21-L26)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.date2epochdays' href='#Dates.date2epochdays'>#</a>&nbsp;<b><u>Dates.date2epochdays</u></b> &mdash; <i>Function</i>.




```julia
date2epochdays(dt::Date) -> Int64
```


Take the given `Date` and return the number of days since the rounding epoch (`0000-01-01T00:00:00`) as an [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/rounding.jl#L29-L34)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.datetime2epochms' href='#Dates.datetime2epochms'>#</a>&nbsp;<b><u>Dates.datetime2epochms</u></b> &mdash; <i>Function</i>.




```julia
datetime2epochms(dt::DateTime) -> Int64
```


Take the given `DateTime` and return the number of milliseconds since the rounding epoch (`0000-01-01T00:00:00`) as an [`Int64`](/base/numbers#Core.Int64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/rounding.jl#L37-L42)

</div>
<br>

### Conversion Functions {#Conversion-Functions}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.today' href='#Dates.today'>#</a>&nbsp;<b><u>Dates.today</u></b> &mdash; <i>Function</i>.




```julia
today() -> Date
```


Return the date portion of `now()`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/conversions.jl#L74-L78)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.unix2datetime' href='#Dates.unix2datetime'>#</a>&nbsp;<b><u>Dates.unix2datetime</u></b> &mdash; <i>Function</i>.




```julia
unix2datetime(x) -> DateTime
```


Take the number of seconds since unix epoch `1970-01-01T00:00:00` and convert to the corresponding `DateTime`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/conversions.jl#L42-L47)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.datetime2unix' href='#Dates.datetime2unix'>#</a>&nbsp;<b><u>Dates.datetime2unix</u></b> &mdash; <i>Function</i>.




```julia
datetime2unix(dt::DateTime) -> Float64
```


Take the given `DateTime` and return the number of seconds since the unix epoch `1970-01-01T00:00:00` as a [`Float64`](/base/numbers#Core.Float64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/conversions.jl#L54-L59)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.julian2datetime' href='#Dates.julian2datetime'>#</a>&nbsp;<b><u>Dates.julian2datetime</u></b> &mdash; <i>Function</i>.




```julia
julian2datetime(julian_days) -> DateTime
```


Take the number of Julian calendar days since epoch `-4713-11-24T12:00:00` and return the corresponding `DateTime`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/conversions.jl#L113-L118)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.datetime2julian' href='#Dates.datetime2julian'>#</a>&nbsp;<b><u>Dates.datetime2julian</u></b> &mdash; <i>Function</i>.




```julia
datetime2julian(dt::DateTime) -> Float64
```


Take the given `DateTime` and return the number of Julian calendar days since the julian epoch `-4713-11-24T12:00:00` as a [`Float64`](/base/numbers#Core.Float64).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/conversions.jl#L124-L129)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.rata2datetime' href='#Dates.rata2datetime'>#</a>&nbsp;<b><u>Dates.rata2datetime</u></b> &mdash; <i>Function</i>.




```julia
rata2datetime(days) -> DateTime
```


Take the number of Rata Die days since epoch `0000-12-31T00:00:00` and return the corresponding `DateTime`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/conversions.jl#L95-L100)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.datetime2rata' href='#Dates.datetime2rata'>#</a>&nbsp;<b><u>Dates.datetime2rata</u></b> &mdash; <i>Function</i>.




```julia
datetime2rata(dt::TimeType) -> Int64
```


Return the number of Rata Die days since epoch from the given `Date` or `DateTime`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/conversions.jl#L103-L107)

</div>
<br>

### Constants {#Constants}

Days of the Week:

| Variable    | Abbr. | Value (Int) |
|:----------- |:----- |:----------- |
| `Monday`    | `Mon` | 1           |
| `Tuesday`   | `Tue` | 2           |
| `Wednesday` | `Wed` | 3           |
| `Thursday`  | `Thu` | 4           |
| `Friday`    | `Fri` | 5           |
| `Saturday`  | `Sat` | 6           |
| `Sunday`    | `Sun` | 7           |


Months of the Year:

| Variable    | Abbr. | Value (Int) |
|:----------- |:----- |:----------- |
| `January`   | `Jan` | 1           |
| `February`  | `Feb` | 2           |
| `March`     | `Mar` | 3           |
| `April`     | `Apr` | 4           |
| `May`       | `May` | 5           |
| `June`      | `Jun` | 6           |
| `July`      | `Jul` | 7           |
| `August`    | `Aug` | 8           |
| `September` | `Sep` | 9           |
| `October`   | `Oct` | 10          |
| `November`  | `Nov` | 11          |
| `December`  | `Dec` | 12          |


#### Common Date Formatters {#Common-Date-Formatters}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.ISODateTimeFormat' href='#Dates.ISODateTimeFormat'>#</a>&nbsp;<b><u>Dates.ISODateTimeFormat</u></b> &mdash; <i>Constant</i>.




```julia
Dates.ISODateTimeFormat
```


Describes the ISO8601 formatting for a date and time. This is the default value for `Dates.format` of a `DateTime`.

**Examples**

```julia
julia> Dates.format(DateTime(2018, 8, 8, 12, 0, 43, 1), ISODateTimeFormat)
"2018-08-08T12:00:43.001"
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/io.jl#L469-L480)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.ISODateFormat' href='#Dates.ISODateFormat'>#</a>&nbsp;<b><u>Dates.ISODateFormat</u></b> &mdash; <i>Constant</i>.




```julia
Dates.ISODateFormat
```


Describes the ISO8601 formatting for a date. This is the default value for `Dates.format` of a `Date`.

**Examples**

```julia
julia> Dates.format(Date(2018, 8, 8), ISODateFormat)
"2018-08-08"
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/io.jl#L484-L494)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.ISOTimeFormat' href='#Dates.ISOTimeFormat'>#</a>&nbsp;<b><u>Dates.ISOTimeFormat</u></b> &mdash; <i>Constant</i>.




```julia
Dates.ISOTimeFormat
```


Describes the ISO8601 formatting for a time. This is the default value for `Dates.format` of a `Time`.

**Examples**

```julia
julia> Dates.format(Time(12, 0, 43, 1), ISOTimeFormat)
"12:00:43.001"
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/io.jl#L498-L508)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Dates.RFC1123Format' href='#Dates.RFC1123Format'>#</a>&nbsp;<b><u>Dates.RFC1123Format</u></b> &mdash; <i>Constant</i>.




```julia
Dates.RFC1123Format
```


Describes the RFC1123 formatting for a date and time.

**Examples**

```julia
julia> Dates.format(DateTime(2018, 8, 8, 12, 0, 43, 1), RFC1123Format)
"Wed, 08 Aug 2018 12:00:43"
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/io.jl#L512-L522)

</div>
<br>


