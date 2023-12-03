<script setup lang="ts">
import { ref } from 'vue'
//猜你你想搜
const guessList = ref([
  { id: 1, text: '中方回应“禁用iPhone”', isRecommend: true },
  { id: 2, text: '上海一女子与房东起争执', isRecommend: true },
  { id: 3, text: '韩称将实施福岛水产禁令' },
  { id: 4, text: '解放军战机与山东舰联训' },
  { id: 5, text: 'Ella曝自己半边身体麻痹' },
  { id: 6, text: '缅北返回人员谈被骗过程' },
  { id: 7, text: '疑似被困缅甸博士发声' },
  { id: 8, text: '拜登再称不愿与中国脱钩' }
])
</script>
<template>
  <div class="search-guess-top">
    <span class="guess-title">猜你想搜</span>
    <div class="refresh-button">
      <svg
        width="14"
        height="14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class=""
        viewBox="0 0 14 14"
      >
        <path
          d="M12.752 6.425c-.097-1.187-.506-2.075-1.17-2.94a5.775 5.775 0 00-8.887-.335.525.525 0 10.783.7 4.725 4.725 0 017.27.273c.536.698.859 1.377.95 2.302h-.735a.35.35 0 00-.293.542l1.284 1.964a.35.35 0 00.586 0l1.284-1.964a.35.35 0 00-.293-.542h-.779zM1.248 7.574H.47a.35.35 0 01-.293-.542L1.46 5.07a.35.35 0 01.586 0L3.33 7.032a.35.35 0 01-.293.542h-.736c.092.925.414 1.604.95 2.302a4.725 4.725 0 007.27.273.525.525 0 11.783.7 5.775 5.775 0 01-8.887-.334c-.664-.865-1.072-1.753-1.17-2.941z"
          fill="#2F3035"
          fill-opacity="0.7"
        ></path>
      </svg>
      <span class="refresh-text">换一换</span>
    </div>
  </div>
  <div class="search-guess-container">
    <div class="search-guess-box" v-for="(item, index) in guessList">
      <div
        class="search-guess-box-title main-box"
        :class="
          index % 2 === 0 ? 'search-guess-box-left' : 'search-guess-box-right'
        "
      >
        <span
          class="search-guess-text"
          :class="{
            recommend: item.isRecommend
          }"
          >{{ item.text }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-guess-top {
  align-items: center;
  display: flex;
  height: 40px;
  justify-content: space-between;
  padding: 0 20px;
  width: 100%;

  .guess-title {
    // color: #000;
    color: var(--color-text-t0);
    font-size: 14px;
    font-size: 13px;
    font-weight: 600;
    line-height: 22px;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .refresh-button {
    align-items: center;
    cursor: pointer;
    display: flex;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;

    svg path {
      fill: var(--color-text-t3);
    }

    .refresh-text {
      color: var(--color-text-t3);
      font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
      font-size: 13px;
      font-weight: 400;
      margin-left: 2px;
    }
  }
}

.search-guess-container {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 6px;
  padding: 0 20px 0 16px;
  .search-guess-box {
    flex-basis: 50%;
    overflow: hidden;

    .search-guess-box-left {
      margin-right: 6px;
    }
  }

  .search-guess-box-title {
    padding: 0 4px;
    width: auto;

    &:hover,
    &.QWsKM5ZL {
      background: transparent;
    }

    &.main-box.QWsKM5ZL,
    &.main-box:hover {
      // background-color: #e4e4e6 !important;
      background-color: var(--color-bg-b3) !important;
      // background-color: rgba(228, 228, 230, 1) !important;
      border-radius: 4px;
    }
  }
}

.search-guess-box-title {
  align-items: center;
  // color: #161823;
  color: var(--color-text-t1);
  // color: rgba(22, 24, 35, 1);
  cursor: pointer;
  display: flex;
  height: 32px;
  overflow: hidden;
  padding: 6px 20px 6px 18px;
  padding: 0 20px;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 100%;
}

.recommend {
  // color: #fe2c55;
  color: var(--color-primary);
}
.search-guess-text {
  font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.jHBrjtT1 {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAABbeSURBVHgBzTsLkJ1Ved9395Vkk2w2sARTCIGmdEwgQXdap4Bt6Ein6FjA6VZLFWpLEUspWhFnrJK72tqh4qhTnFKYYdAyRV2Vh7Vo0RpaKcoYeYSNkKZhIZAQNg+SzWZf9z9fv9c5//nvvQtRmI5n5t7/dc75z/d+nR/gZ21EQABIRPaTc4AaQb1m1/E+X4Nf17Nz61/9EWDlOdn89rrKe/QHr2E75snSi0nOfFid79XtBIZGW+ca4d+Qn69bR+l+Pf3x8yGEkRHSY/M4GVOve986ZYsmeI3aKyJAsM9Nya5IGK7bGF2YLHrcrgdPR9iyBWDtaQgLd3LXQb29he8NDg6WEy5ZSTCx28Zs2U46Lrapg3a+sJ/Hb/H+bycYGHWAGSsj23gtdeUZXZCs7VW0Y+IABbzOgNeZykKZ8XWYgJBFzx5BOGkFwkw/wp6DBK+btGd7emkMxmD16tUAzy2hscYEAp+ufm4vn0+h3pc2w/13+cvW9JJe7xk3wBYNBNgmCF1CsHEjKDKUMzbR/wsC6PK7NgIUFwPVfo8vTzHmCwhBzgo+ilLgYxGEKnYEPfIhGPqkSwgq3BDKe9KXeK50n3hsCLamEEjHiy6QKUNBul675/1l4jTW+uoRHuU1PQozc8P45M1jPxcC6AN3LYOJUOcu12gvWasApgiguEC+LiAByz8DNCgsKjgKsPRzoMnHylz8jLgvBgdK5tBngA6gwoixv1yEOJe83xGiayFMcwBBQhSFz0FHzzA++rmXjgkBqn0/eHcfTML3+eIsVzdpwUYdBdo4QI+8qKIwYBxAPmfKoj2TccopfC5vLIoMSP8FA1buqcpRBDoiBUDmdeWCwOvQaf0nBCiJAo41zBAgf49B58x5+OjtLUiotWBE3i6UD7DB8COzk7M6T1rMGQBhDqHR4Jc25MjXDV5oA6ghzxuIBZ8X0keveS0N45bGHOOmkPs6RucqeDzpeEYZL5iRiXJPkCHIFsRpnxApXiLOCJDfQ71WTggCAioh57o3wTFxwOVfPRWga6eRg0rTJ9gno7RygC1MgTMK5xyQ6QdwGVaWda0lAEIpDsotEClKNre/FiMVjUOq/aJ+Mb3kfXMOCCX3yrohnIdP3r45h7ezArwqmc5NzjvyLpNhFDYunJUbLgKFI8XFQDggigklcZGFqBg7IGgyRkknsM5ATOxaAgXmHcVrGyc6A51qFKJS5PuKKdNPkUsoIb90Gwgu4v/2CNB1DQ+LOTrLgHf5BQGWhC1Rqaxs24jUR5VPQcK+vczes6a0nCrY0QGwrN+JHcxgGXWUSqbgGIkTh0ycSFnHARTL10dGFIiKUlZlHOWLFu9RIaSMy8xX8n5JD8j5hfz3gfYcoN5dHeBPRfaVpVC1q2BQqE8GvMqkyLpzgcizAnHgOYT3/m6SKT3edh8DsQRQFbYDpwsFVWhoFETYz8h7z/kAfb2lTN58F9DiJc45kLjAFZ5ZgIgo5yzAeC+UliZxgirIU6CpJQQIOUg5IMqhmByXcwdWWdVFQJSUAw+KoKW9AB95T3X2r/+nKs3IFYJkUkoaq2JiYz5ceTHAqhXl2DvvN2Q7cSP3OIckXwExecbme6AjJc5LUQTiebWpFdD5h4drMDpaYpBU5p3t3YwVLvuFcgCqKMRfO/dcfaSGmipRkHKOUeNTocrPtHubsTqe+yjCVIEpK6tpTBqeMv8iGJZs7ZT8gXQv6ph5OEDjjY3s1/cWmW02ZwfV1jaQXPujcYAAzmtpKHvhPPGJiIfKacm+SRco10UL0A5+IUISdxcfhdqpaw+MtSCUHVUpQmkajY3Qz9sgwCcGHCK6jABz91KBDsnU4dFJ0fiMDPUH3C43oD0MfHN2Kuo0A1T6dXW6XgquuefjgOh4mR8UQ3E17tENVgfJlV9kfaSkKE01JE6h9giQNsz9Nq5zShnr29GdjSjvO7YinHlykwPBkrTq9a0A/OoqgMNHqn23/i8joAuwbzEkD+7E/taxrA9w9z4770h3EZOZ4P/n9wMdd3x0dihxVynzkJtVgFYdkJIOgKwAB3d3wNrfmjWlR+6pzaFqf0FCMQPwxI8Rxr4MP3c761JWlu8G+MPfgVfdBv+Eo9HoJockYmBAZS550hOEY1+reL96oe6vJzQo+tjgXBCIXPuL0n4tcxGvQcuUXLT9laCKPHVDZf+m1hQLbDGHQz1Zd3099CWK2vgXq1HSIQGohfVzZV7MbwVUsYxwkmGw366S0ovhbVENZx98rP1qztlQvX6C5f3Qkeq95utX25RI5LqO3JMsTZ89iGpoPh0gx6GhGuzcWaM1V81iEQOdIuoBc2hYDPDF3QDTRzUOIOUOshcu6Qb4ye3V2d/4x0AvZQDLixqF+w1Zm+X59327ek90xd4DaZy6ys19Bt8LdHTOY1byyNAVZQqx8yCJ7+26pyOX487yDX/ACmUKsczYmI9PnqmJ1F9+vCBDTaGHsxLqMmDT0NJqLGHLlpTXMk3pqZVIeWF/61iOI2igP/XFfW3zGeC5AXURo5VzdoAEZwrMDAZCN6V85Togcsa6ks0ZeHKvizzbopYgmpNoh5PMzb++iq3Pj3H8yuNbBz63t3z+coo3BPeUA6LzM6YwOVjEqvej9zhc8bsMAZLwHB/PAglLc2mCXrAb1GVDSKmwiCQD5OUSizHLA0eOAr7IlD542LI+4wcB5uYMuJMHqoNETwj3vGK+Myk7138ar8Q8IWHOuRHxYu0k5rG1oSFgU51TzwPWIxhlyfN7SQwsf+dhZjBGinlAmodKAigDjaecAHg551Q/c7V5dQLgNe8EPG+QEXEIYOni6rgnOB/TUWvinHYIQHAX0TsoD6CbR1Qux5hC83hAag4e80hH0wGS6x/fjLCNKXG6JR3RkhWefdFEp3FBtBCZucEQoG375BUA527QMFfbg48DTrGueOdbzBmS1mw5pDGCsLvTzRpAOx9eW1TWaAkXjZFjAibPRiV/gaS0IH5lIVwvXoIhQIocnHPfseYIrilTzJAUoAHMeb45swBHuQ4wOwPIP+hmSr3uOIC3ntu6wLed3XrvpBOqYfMl57f2+cHjTJrO1vvP7q2GzNKECULUgKT0VtZH8KRRyjKbzI7y1QnrpKLFF3X0t9RBMkVr9JzKfF+0p4LJuVmCXdtRgVp3GqAs5Mxfbl3QK7Vz1r/yGI0Xoo/mXFCbp2+pKDFGgpQ0fqb9Y85Aijibv8noebvA7SKgpaYhgrXcq8gisJhQEPaq1RDZ8sHfXlmy9LG0Q5Ms0zsAvvUQwLd/CMS2HX/EZPjQJRwPnN9+jCjMozNAixakBAe/v1XZnsyI3D4GNMO+QGeHub6Wj8uTINWiyvTSGqxdzNUl1gMjdccr1q3ktc0xrhxQkCk+1wVyXLCQ2fOxY4Yd3j0M8GscsFzC/PaNB1jr87zH9QFNzQJcdxPAR//RENTc7r6BReocwImpdEt13bMvtPYVRXtkWhQpl+bmTNpNGHxgpkfUjzlkMI+Y1XPGqtuBdYDH/4bFkGt3Pi5eqoqs0naxXN757wA3/HPr4p5k6ixipC3jcT1dTEVX0nykfr533w/bc5OEyl+4FuCq3wc86J6kWAV5V96iKK06kZH294B/wZalb6l5lp6Kd9eojBBnFtTg6HhN64wAmRIcHfU+ifVN+2s8UJii6VlArKAQPnqzKaSHtvKEnB5b0AO4dGFrThBiFieuwecVak4yda+4EF62iaVgE4n1W7hi3NPKLYKoOfZGlyw0ZGiYfT6b1z/nBNaMcgOWfouJhRRrpEK7eTOI3nM/YJOtcsczhFndLrWoZMU52cfsdu/DjLDdTMUBoBX84qXs7mJ7LaXGKXdN0eIBFBe5OSfw7N7WCd7PqfzPfpD1wpQpx7ydeZrkLQwRsQkiDk9WlSO4VxiJ0XiKcx8TEv9gmQ8QB2HtOki2M7j5c4vgXhWyGBAt4hd2dLZ6We0xUB7immSBogSbrcFF15leaG5iKtcysP+9tXr/jDWALPcVR8qjTXSfwN+eOUvSTuLIn8vtIyPBssLKHiME28ZDqgEmUwLJGriBwRyz8HJ+us1SYkKoP8HAX3pBq/0XPbL/ENAd3zHlmbM71whg7DmAPePV+8IBKwfsGJt6kTFCLpOnmurTNPty2L1iyjiARTHx7Yjs9pDdGsFj/1BQ8vig9Pu1PrCTzdru3YB7XwQ8cJAVFbuzv3RcK/DRD4mLEG29nn2HT11Z7Sesf+O/cCGEZXlxD9APHmEz/WEDNj7r5fusSBVReXvfO6qipHEEeMQHkMJ68xi5HYCVexeScsD112OZD5Df4BUd0LdqNvr+FrdHJVikHD8e5mTlw7eaWYoUEaeoWaOveBvQCcsNeE6OwpvZ7f3Ch1v7MbD006fZq4zROa9oij3NVSu1Lz31tKoYdfB6md0f+SLM21hB0xfvYSQEq0hpITa428zz9i/pgwbb4dXQYEVYZJqrbnt23JtK1A/REmTcMMPFjK07DOhz19uvGaitzIpdDpAkRdazn3lHvbXfDXdw9f5/DPgsvMaF3UBjzzOwTxlFzZUBGj9gIjFfEzNdo5QMSSV0D/JEBGSji0tuprrFGxTbGLemiAgUMTL0RVl4zOawB1v8geZ28zcAxAeQt0jZ7OFtrb6CAH8Ta9/eBbH0lY66voXsO/R2VxVtL4vB9f/UHgkiLk/uNHmPxNMFxGIpw9UxwQ+eAXjAoNaMe13T4iwOY6NcPhzY5LYb81AYY4JB6vA1RvEhruhe0mTGRBy2/FTZEL77YwUsNXZr8b8esxyARIgC/Oe/whyxyADP/Vx3GWyJVFWkwYnwHzz/GIvgsl7zKyT/eCkrz+kjGqpjcCuQ9hlZnRH6ln+Kr4vN68+h1c88QLkO4MZ5wTevbbjMl3uArCRGVsvXmh6nqPZiTJxYYoNbT7dVfdgxEs8vLd6tkb5ErMDqlUBPM3uL0tOqVkgAmrhx/w6EGOKmNsvr6uiycPrWu5lD+F3sXmODrHjSZX5HqmJlFS1Xhvzu/sVQ9M1xVMhKbaQoS2OSKhpib3BP0NSX1d1TdCVYL6uwclx+nPHrgQMIf/UuW+BXvwckrmt3V2kho0c5W1hiUxjr+RcNeLkSt1W8OYkTxNtbdyrgrheBjkzEyr9x4CTHD2/5dbYg7zf/4WR2fz9xiyGh3JtkabuYA8xD++jbdHXzbyfXQcR0oofDcW9ARIayUIgVVs4DaF5N2SrV3WVtDc4Sv2FNmdwQN5Rjebjms+whLjfNL5ywdjU7Lawwz+CXfuV7AE+NGbVlzDQDduFvWnlclKo0lm/8m9s4juiyfgJ8/c+sT2ziIe5iEbidNX43QqoEaXksVPOVsWIs1/uPBBhjE7hlRMPcqv8qGyDLXIAqDgoxKWqFh9K+Mt5e4kztTdeW44Uy4i71dHoIy11v/xi7zp822y864+wzDWgws0as7VV5ReAdkdDdXboggohP39HqKjPiccWAUD1SOvr+qWCaLIFSme93nskzDhBt2qTTmyusWpOtwObRaj6wyBMjlJXA+TjJ1L3sglZ3lpUbLHZTJ2bwzvurz4VLpudKMytIeni0GmaLb/++i1U0rB7HLy84IXPVjdW5pN+XNjGyFnny1UrxVokn24Vi7E/m2BW0A3bo0E8MDyvC0gYJSQ9JdZjM7pNvXNIJEsk9P6gyu2wRtkR/4qWJDpC9QfJi0QXf+VG1jyBMUmghc1EXMbX/7aFqvysv4qTInFtfS3XBT0ZbYwXhnGsv5ZgALDcIFOMA1/7OzbY7BNf0nRwk97FJWJWDu9wRIgkR0XVAVGAprV0Eqw/KLPtYid31d1WnRkzgjXcCLOihyCkKnLB7cxLlgt8oPTPh1E5G2Jfvr/r5Qt03nVFyoPxE1m+9p3U+0QdvYtPaiIncFAKnFDnk0aCUATFkhZFohMURSlrTo0Bw6qNt4ISD7Il96F1tWJ+dnIMTQn3fVOm744QbOECptLeerWJQIptFboZJuHVHtZ/kH6cbXptwb24Br+jqz7TmBiSBwkYN08aOSPmCIE+PibfLUhM3lBgCVAWwCEiSoNy3SxATjbFNvIR41YWtiQ9RTrf9K1N/gdfk09Y2wq4OzfJWmkRvku8j3/0oAHbW2uuL3l6VZ0ofYvD69rxAcMOXqn2FINddpkhIyY8yqvV0PiNjI98ZprTLvOSAuk8UWT76Y5RhVIbIInNtLJS46CNAnBTx7Tq2ywT86w5JojzUFMcLe7/+VADTb2i2hcfc91Dbfsm2x0JMB/e/5a4yQSJv+9aDbD6/zudzVEaA0QT6dtpowQQD0MwB0oa8OpRsqBVJvPJDsJTzbTM8x29fXVKLlZI4P+Ie6/xR/jwM1rGT0yXSxGUVP17ye3MFVGRz8qjJtyBVSvAiVpI8KWyrTvTsdKdYR8Ncbgm0/pqPl36cx0k9cQ7Stt6QNnz5Vh++v3nAiEOZd0rgFg7ZFd5wYqNSEbZ0Evq+WZNb2SZ3+DDg4K8APMoA9S6y/nFHtxciyPbuWDVIKr0TRxVIVXodaKrHAxflnVkeu2IAtTAqpKnxsxropvO4Z5hsd5lVgRrM7kv7GPD9zEOztqs8ur62P9jd+VCmxi/a0AkjXwuq3xDzWIB1AHCufP3ADr5xiu3BC2WG2PNqmCuU6SlSU2c5d4KYe9dJg+cCwTR+LEdmGdqUZjM0+3cBUN33H5vaeN9zHIEB8qJvwwOgIjlBaW+Qbuw0K8BPHse5P3qjeaHDoRQBaXXwD5zwXrf5Zc7Ps6K6MssU2U+8NUhbAMuNStWvOSjxmUVyVO4+8aKL+x4VZZVMWdCkhm2hV2dGORKioxYaFHeuprFU2D4HFQFKESH3ecSQWuqApowdc8H68fN40vsTVa0iDImyHhck8fBNkpXMb6R+uYeg5IxgqamYpUXXE7aV1hGWlbNSv/iOtAc4xirosu4cmsx4FgiRc0YnroGZHU/bgoCqHKCmkI/vGPg+Q/kPynKUbYSIlI1b0oJ+2EAx5sb40YJ8PFEE8t3dmKhFFDU5+e4zl9nCvc6CfD+iL7zwVJwrP+MASMotcpBRnuIO1tJiRW4Ibm3C52HmDWNQYGWrW8kBlhQB2yvU3w/TxXd54HrI9vb7bgv71scpnRylXDaj7tC+mc5w74P8s5gkIk7xFNZC5ou4eGH8iELHQkbd6royBBjV4yczvV3nw8T2A+YE10N0/qr1RlMlqImR0zv7obbw4zzBX5r8RsXj/kBeOo/21RdpfV1sjGNy0+rf/UDV6cpFJcotGjKt2k2ZO0vmbUq91LiCSudHrVQZDgMxN3d9kr0qAZ5AzQpRewRAk0XgNrO259SeRu1j/JKz+Lch+dhIGWAxgUpuAl3rOyeo6UofOrkMV2L1irK1+by252T3+TPLEBVctCoCNKQw+Bm+cy+b0W/CuaseYA836DbCckdUqwiUwMdWt89i676FfqPvIZrggoLk1NcOzFextyZ1+G4uQ8sxtsYKPh/zc7b3nb22kMYkn8uHkqtBn+sz/3BS7q328fGDy86F9qxncZkxk69Vl/C6Nsta+SdbfuSTXAXieiZYR+n9ZK2FAxQR5F/mVJ7W/WrUqkiQfesbvw+WhIqsQF4um67U6+LjRn++2RcnTRApTRYdr+V8Qj7BvYVgcNCuT+fr7dspjY9tYwRSXyzvDXH5XOuUjVB2rmStxU/v4JgaUekgUf7lNjV/7Q3Zr+1X4jX96f26HfXc7w8NdaTz/J4JTI2zNuX4NE6PNr/1w5Z1Qvn1eQ7Pa9LiC3xmiH58XEC7/n6K+XXeP194mje/n31KX52coHnMz9r+Dy3mnaAA1t/JAAAAAElFTkSuQmCC);
  background-position: 50%;
  background-size: 16px;
}
.dgH2Pao8 {
  background-repeat: no-repeat;
  background-size: cover;
  flex-shrink: 0;
  height: 14px;
  margin-left: 3px;
  width: 14px;
}
</style>
