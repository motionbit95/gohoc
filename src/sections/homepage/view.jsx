'use client';

import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import { DashboardContent } from 'src/layouts/dashboard';
import { Editor } from 'src/components/editor';
import {
  createHomepageNotice,
  updateHomepageNotice,
  fetchHomepageNotice,
} from 'src/actions/homepage';
import { toast } from 'src/components/snackbar';

// 카드 스타일 개선
const SectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[2],
  background: theme.palette.background.default,
  marginBottom: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(0.5),
}));

const SectionDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1.5),
}));

const SaveButton = styled(Button)(({ theme }) => ({
  minWidth: 120,
  fontWeight: 600,
  fontSize: 16,
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[1],
}));

const defaultNotices = {
  photoUpload: '',
  referencePhotoUpload: '',
  requestGuide: '',
  requestExample: '',
  agreement: '',
  historyNotice: '',
  progressStatus: '',
  progressStatusSample: '',
  reuploadGuide: '',
  rereferencePhotoUpload: '',
};

function getWorkspaceId() {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem('selectedWorkspaceId');
    } catch (e) {
      // ignore
    }
  }
  return null;
}

export function HomepageSettingsView() {
  // 주의문구만 사용. 위치에 따라 적용됨
  const [notices, setNotices] = useState(defaultNotices);

  // 워크스페이스 ID 추적을 위한 ref
  const prevWorkspaceIdRef = useRef(getWorkspaceId());

  // "수정 후에도 에디터 값이 그대로" 문제 해결을 위한 forceUpdate 트릭
  // 각 Editor에 key를 부여하여 notices가 바뀌면 Editor가 remount되도록 함
  const [editorKey, setEditorKey] = useState(0);

  // 워크스페이스가 바뀔 때마다 default 값 불러오기 (워크스페이스별 조회)
  useEffect(() => {
    let isMounted = true;

    async function loadDefault(currentWorkspaceId) {
      // 항상 default 값으로 초기화
      setNotices(defaultNotices);

      try {
        const data = await fetchHomepageNotice(currentWorkspaceId);

        setNotices({
          ...defaultNotices,
          ...data,
        });
        // Editor 강제 remount
        setEditorKey((k) => k + 1);
      } catch (error) {
        setNotices(defaultNotices);
        setEditorKey((k) => k + 1);
      }
    }

    // 워크스페이스 변경 감지: storage 이벤트 + polling fallback
    let intervalId;

    function checkWorkspaceChange() {
      const currentId = getWorkspaceId();
      if (currentId !== prevWorkspaceIdRef.current) {
        prevWorkspaceIdRef.current = currentId;
        loadDefault(currentId);
      }
    }

    // 최초 로드
    loadDefault(prevWorkspaceIdRef.current);

    // storage 이벤트 리스너 (다른 탭에서 변경 시)
    function handleStorage(e) {
      if (e.key === 'selectedWorkspaceId') {
        checkWorkspaceChange();
      }
    }
    window.addEventListener('storage', handleStorage);

    // polling fallback (같은 탭에서 변경 시)
    intervalId = setInterval(checkWorkspaceChange, 1000);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorage);
      if (intervalId) clearInterval(intervalId);
    };
  }, []); // 의존성 배열은 항상 빈 배열로 고정

  const handleNoticeChange = (field) => (value) => {
    setNotices((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let result;
      if (notices.id) {
        result = await updateHomepageNotice(notices.id, notices);
        toast.success('성공적으로 수정되었습니다.');
      } else {
        result = await createHomepageNotice(notices);
        toast.success('성공적으로 저장되었습니다.');
      }
      // 저장 후 기존 notices 내용 유지 (초기화하지 않음)
      setNotices((prev) => ({
        ...prev,
        ...result,
      }));
      setEditorKey((k) => k + 1);
    } catch (error) {
      toast.error(error.message || '저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <DashboardContent maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          홈페이지 주의문구 설정
        </Typography>
        <Typography variant="body1" color="text.secondary">
          홈페이지의 다양한 위치에 표시될 주의문구를 입력하세요. 각 위치에 맞는 문구를 입력하면 해당
          위치에 적용됩니다.
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 0,
          bgcolor: 'transparent',
        }}
      >
        <Stack spacing={3}>
          <SectionCard>
            <SectionTitle variant="subtitle1">[신규 접수] 사진 업로드 안내 사항</SectionTitle>
            <SectionDescription variant="body2">
              신규 접수 시 사진 업로드 안내에 표시될 주의 문구를 입력하세요.
            </SectionDescription>
            <Editor
              key={`photoUpload-${editorKey}`}
              value={notices.photoUpload}
              onChange={handleNoticeChange('photoUpload')}
              placeholder="내용을 작성하세요."
            />
          </SectionCard>

          <SectionCard>
            <SectionTitle variant="subtitle1">[신규 접수] 참고사진 업로드 안내 사항</SectionTitle>
            <SectionDescription variant="body2">
              신규 접수 시 참고사진 업로드 안내에 표시될 문구를 입력하세요.
            </SectionDescription>
            <Editor
              key={`referencePhotoUpload-${editorKey}`}
              value={notices.referencePhotoUpload}
              onChange={handleNoticeChange('referencePhotoUpload')}
              placeholder="내용을 작성하세요."
            />
          </SectionCard>

          <Divider sx={{ my: 2 }} />

          <SectionCard>
            <SectionTitle variant="subtitle1">[신규 접수] 요청사항 작성 안내 사항</SectionTitle>
            <SectionDescription variant="body2">
              신규 접수 시 요청사항 작성 안내에 표시될 문구를 입력하세요.
            </SectionDescription>
            <Editor
              key={`requestGuide-${editorKey}`}
              value={notices.requestGuide}
              onChange={handleNoticeChange('requestGuide')}
              placeholder="내용을 작성하세요."
            />
          </SectionCard>

          <SectionCard>
            <SectionTitle variant="subtitle1">[신규 접수] 요청사항 작성 예시</SectionTitle>
            <SectionDescription variant="body2">
              요청사항 작성 예시 문구를 입력하세요.
            </SectionDescription>
            <Editor
              key={`requestExample-${editorKey}`}
              value={notices.requestExample}
              onChange={handleNoticeChange('requestExample')}
              placeholder="내용을 작성하세요."
            />
          </SectionCard>

          <SectionCard>
            <SectionTitle variant="subtitle1">[신규 접수] 내용 숙지 사항</SectionTitle>
            <SectionDescription variant="body2">
              고객분들에게 동의를 체크 받아야하는 내용을 입력하세요. (꼭 번호 붙여서 입력해주세요.)
            </SectionDescription>
            <Editor
              key={`agreement-${editorKey}`}
              value={notices.agreement}
              onChange={handleNoticeChange('agreement')}
              placeholder="내용을 작성하세요."
            />
          </SectionCard>

          <Divider sx={{ my: 2 }} />

          <SectionCard>
            <SectionTitle variant="subtitle1">[접수 내역] 주의 문구</SectionTitle>
            <SectionDescription variant="body2">
              접수 내역 페이지 상단에 표시될 주의 문구를 입력하세요.
            </SectionDescription>
            <Editor
              key={`historyNotice-${editorKey}`}
              value={notices.historyNotice}
              onChange={handleNoticeChange('historyNotice')}
              placeholder="내용을 작성하세요."
            />
          </SectionCard>

          <SectionCard>
            <SectionTitle variant="subtitle1">[접수 내역] 진행 상황 문구(신규)</SectionTitle>
            <SectionDescription variant="body2">
              진행 상황 하단에 표시되는 문구를 입력하세요.
            </SectionDescription>
            <Editor
              key={`progressStatus-${editorKey}`}
              value={notices.progressStatus}
              onChange={handleNoticeChange('progressStatus')}
              placeholder="내용을 작성하세요."
            />
          </SectionCard>

          <SectionCard>
            <SectionTitle variant="subtitle1">[접수 내역] 진행 상황 문구(샘플)</SectionTitle>
            <SectionDescription variant="body2">
              진행 상황 하단에 표시되는 문구를 입력하세요.
            </SectionDescription>
            <Editor
              key={`progressStatusSample-${editorKey}`}
              value={notices.progressStatusSample}
              onChange={handleNoticeChange('progressStatusSample')}
              placeholder="내용을 작성하세요."
            />
          </SectionCard>

          <Divider sx={{ my: 2 }} />

          <SectionCard>
            <SectionTitle variant="subtitle1">[재수정 요청본] 업로드 안내 사항</SectionTitle>
            <SectionDescription variant="body2">
              재수정 요청본 업로드 안내 위치에 표시될 주의 문구를 입력하세요.
            </SectionDescription>
            <Editor
              key={`reuploadGuide-${editorKey}`}
              value={notices.reuploadGuide}
              onChange={handleNoticeChange('reuploadGuide')}
              placeholder="내용을 작성하세요."
            />
          </SectionCard>

          <SectionCard>
            <SectionTitle variant="subtitle1">[재수정 참고사진] 업로드 안내 사항</SectionTitle>
            <SectionDescription variant="body2">
              재수정 참고사진 업로드 안내 위치에 표시될 주의 문구를 입력하세요.
            </SectionDescription>
            <Editor
              key={`rereferencePhotoUpload-${editorKey}`}
              value={notices.rereferencePhotoUpload}
              onChange={handleNoticeChange('rereferencePhotoUpload')}
              placeholder="내용을 작성하세요."
            />
          </SectionCard>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <SaveButton type="submit" variant="contained" color="primary">
              저장하기
            </SaveButton>
          </Box>
        </Stack>
      </Box>
    </DashboardContent>
  );
}

export default HomepageSettingsView;
