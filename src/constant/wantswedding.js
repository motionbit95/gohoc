export const PHOTO_UPLOAD_GUIDE = `
- 사진은 업로드 후 변경이 불가능하니 신중하게 업로드 부탁 드립니다.
`;

export const REFERENCE_UPLOAD_GUIDE = `
- 해당 창은 참고사진을 업로드하는 곳입니다. 원하시는 작업 방향을 참고할 수 있는 사진을 업로드해 주세요.  
  예시: 셀카, 스튜디오 보정본 등
- 참고사진은 **1장만 업로드 가능**하며,  
  **얼굴과 몸이 잘 보이는 정면 사진**으로 업로드해 주세요.
`;

export const REQUEST_INSTRUCTIONS = `
- 상세페이지 기본수정사항에 있는 부분은 작성하지 않으셔도 자동으로 적용되는 사항입니다. <br /> 다만 좀더 신경써줬으면 하는 기본수정사항도 함께 작성해주셔도 됩니다!
- 요청사항 기재 시 **좌우에 대한 기준은 모니터를 바라봤을때의 기준**입니다. (모니터 속 인물 기준 X)
- 요청사항 기재 시 꼭 **모호한 표현이 아닌, 정확한 부분에 대한 보정 방향**을 기재해주세요.  
  * 자연스럽게 (X) ➡️ 얼굴 전체 크기를 줄여주세요. (O)  
  * 예쁘게 (X) ➡️ 눈을 밑쪽으로 키워주세요. (O)  
  * 어려보이게 (X) ➡️ 중안부를 짧게 해주세요. (O)  
  * 착해보이게 (X) ➡️ 왼쪽 입꼬리를 올려주세요. (O)
- **색감 요청 시에는 색감작업(필름) 결제 후** 요청 가능합니다.
- **접수 이후 요청사항 추가 및 변경은 불가능**하니, 빠진 부분이 없는지 재차 확인 부탁 드립니다.
`;

export const DEFAULT_TEXTAREA_CONTENT = `1. 보정강도 (약,약중,중,중강,강)  
(추천 : 자연스러운 보정을 위해 생각하시는 보정단계보다 한단계 낮춰서 진행 하시는걸 추천드립니다 ! )

▶︎

2. 전체 사진 공통 요청사항

신랑 :  
신부 :  

3. 개별 추가 요청사항  
(색감작업은 원츠웨딩 유료 필름 결제 해주셔야 합니다.)

▶︎ 파일명 - 요청사항 :
`;

export const CAUTION_GUIDE = [
  {
    key: 'change',
    label: `<span>주문 내역과 주문자 정보를 올바르게 입력하셨을까요?`,
    required: true,
  },
  {
    key: 'unclear',
    label: `주문 장수에 맞춰 올바르게 파일 업로드 하셨을까요?</span> <br />
<span>(작업 접수와 함께 요청사항과 파일은 변동 불가합니다!)</span>`,
    required: true,
  },
  {
    key: 'storage',
    label: `<span>요청사항 및 작업 여부 완료되었을까요?</span>   <br />
<span> (요청사항 중 불가능 여부에 대해서 사전에 연락 드리지 않으니, 꼭 접수 전 채팅으로 확인
          부탁드립니다!)</span>`,
    required: true,
  },
  {
    key: 'option',
    label: `<span> 상세페이지내 작업 기한, 보관 기한 체크 하셨을까요?</span>    <br /> 
<span>(신규/최근 재수정 보관 기한 : 접수일로부터 2주 간 보관되나 이후엔 파기 되오니,</span>    <br />
<span>개인적으로 꼭 보관해주시길 바랍니다!)`,
    required: true,
  },
  {
    key: 'sample',
    label: `<span> 샘플 진행 시 마케팅 채널에 활용될 수 있다는 점 인지 하셨을까요?</span>`,
    required: true,
  },
  {
    key: 'refund',
    label: `<span>위의 내용을 인지 하셨을까요?</span>`,
    required: true,
  },
];

export const ORDER_LIST_CAUTION = [
  {
    text: `<ul style="list-style-type: disc; padding-left: 20px; margin: 0;">
  <li>
    <strong>모든 작업 (신규/재수정/샘플) 전달은 주문 넣어주신 등급에 맞춰 전달 드리고 있습니다.</strong> <br />
    작업 완료 예상 시점은 진행사항에 표시되어 있으니 꼭 참고 부탁드립니다! <br />
    추가로 모든 고객님들께 공정하게 순차적으로 전송 드리고 있기에, 전송 기한을 앞당겨 발송 드리기 부분은 불가능하다는 점 안내 드립니다!
  </li>
</ul>`,
  },
  {
    text: `<ul style="list-style-type: disc; padding-left: 20px; margin: 0;">
  <li>
    저희가 모든 요청사항들을 적용할 수 있음 좋겠지만, AI가 아닌 사람이 일일이 작업을 진행하다보니 불가능사항이 있을 수 밖에 없다는 점 너그러이 양해 부탁드리며,
    <strong>추가로 불가능한 요청사항이 있을 경우에는 메모로 남겨드리고 있으니, 꼭 참고 부탁드립니다!</strong> <br />
    ㄴ 재수정 신청 시 애매모호한 요청은 채팅으로 가능여부 확인 부탁드립니다.
  </li>
</ul>`,
  },
  {
    text: `<ul style="list-style-type: disc; padding-left: 20px; margin: 0;">
  <li>
    <strong>파일은 [접수 기한]으로부터 한달간만 보관된 후 파기처리 되오니 작업된 파일은 개인적으로 꼭 저장해주시길 바랍니다.</strong><br />
    ㄴ 파기된 파일에 관해서는 책임지지 않습니다. <br /><br />
    ex) 1차 보정본(25.01.01) → 삭제처리(25.02.01) <br />
    재수정본(25.01.05) → 삭제처리(25.02.05) <br />
    샘플(25.01.10) → 삭제처리(25.02.10) <br />
  </li>
</ul>`,
  },
];

export const SAMPLE_DOWNLOAD_NOTICE = `샘플은 보정 강도 체크를 위해 만든 상품임으로 웹에서만 확인 가능합니다.

다운로드 희망 시 포토리뷰(★★★★★) 작성 후 톡톡으로 캡쳐 본 보내주시면 다운로드 가능하니 참고 부탁 드립니다!
 ㄴ 리뷰작성시 꼭 구매확정을 눌러주셔야지 가능합니다!`;

export const HOLIDAY_NOTICE = `휴무일은 작업 기한에서 제외되니 참고 부탁드립니다.`;

export const REVISE_PHOTO_UPLOAD_GUIDE = `
- 사진은 업로드 후 변경이 불가능하니 신중하게 업로드 부탁 드립니다.
`;

export const REVISE_REFERENCE_UPLOAD_GUIDE = `
- 해당 창은 참고사진을 업로드하는 곳입니다. 원하시는 작업 방향을 참고할 수 있는 사진을 업로드해 주세요.  
  예시: 셀카, 스튜디오 보정본 등
`;

export const REVISE_DEFAULT_TEXTAREA_CONTENT = `개별 추가 요청사항 (색감 작업은 필름 결제 해주셔야 합니다.)
                        
▶︎ 파일명 - 요청사항 :
`;

export const REVISE_CAUTION_GUIDE = [
  {
    key: 'change',
    label: `주문 내역과 주문자 정보를 올바르게 입력하셨을까요?`,
    required: true,
  },
  {
    key: 'unclear',
    label: `주문 장수에 맞춰 올바르게 파일 업로드 하셨을까요? <br />
(작업 접수와 함께 요청사항과 파일은 변동 불가합니다!)`,
    required: true,
  },
  {
    key: 'storage',
    label: `요청사항 및 작업 여부 완료되었을까요? <br />
     (요청사항 중 불가능 여부에 대해서 사전에 연락 드리지 않으니, 꼭 접수 전 채팅으로 확인
          부탁드립니다!)`,
    required: true,
  },
  {
    key: 'option',
    label: `상세페이지내 작업 기한, 보관 기한 체크 하셨을까요? <br />
     (신규/최근 재수정 보관 기한 : 접수일로부터 2주 간 보관되나 이후엔 파기 되오니, <br />
     개인적으로 꼭 보관해주시길 바랍니다!)`,
    required: true,
  },
  {
    key: 'sample',
    label: `샘플 진행 시 마케팅 채널에 활용될 수 있다는 점 인지 하셨을까요?`,
    required: true,
  },
  {
    key: 'refund',
    label: `위의 내용을 인지 하셨을까요?`,
    required: true,
  },
];
