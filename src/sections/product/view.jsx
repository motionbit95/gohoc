'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  Grid,
  InputAdornment,
  Alert,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';

// Homepage/view.jsx 참고: 워크스페이스 ID 가져오는 함수
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

// 전송시간은 21(고정), 다운로드 만료기한은 기본 1달, 샘플만 6개월
const DEFAULT_DOWNLOAD_EXPIRE_HOURS = 720; // 30일
const SAMPLE_DOWNLOAD_EXPIRE_HOURS = 4320; // 180일(6개월)
const DEFAULT_SEND_TIME_HOUR = 21;
const DEFAULT_SEND_TIME_MINUTE = 0;

// 마감 정책 데이터: systemDeadlineHours(실제 적용 마감시간, 시간 단위)로 저장
const initialRules = [
  // ourwedding
  {
    id: 1,
    workspace: 'ourwedding',
    productName: '샘플',
    displayDeadline: '2일',
    systemDeadlineHours: 48,
    downloadExpireHours: SAMPLE_DOWNLOAD_EXPIRE_HOURS,
    sendTimeHours: 21,
    sendTimeMinutes: 0,
    policy: '2일 이내',
  },
  {
    id: 2,
    workspace: 'ourwedding',
    productName: '씨앗',
    displayDeadline: '5일',
    systemDeadlineHours: 120,
    downloadExpireHours: DEFAULT_DOWNLOAD_EXPIRE_HOURS,
    sendTimeHours: 21,
    sendTimeMinutes: 0,
    policy: '5일 이내',
  },
  {
    id: 3,
    workspace: 'ourwedding',
    productName: '새싹',
    displayDeadline: '3일',
    systemDeadlineHours: 72,
    downloadExpireHours: DEFAULT_DOWNLOAD_EXPIRE_HOURS,
    sendTimeHours: 21,
    sendTimeMinutes: 0,
    policy: '3일 이내',
  },
  {
    id: 4,
    workspace: 'ourwedding',
    productName: '나무',
    displayDeadline: '2일',
    systemDeadlineHours: 48,
    downloadExpireHours: DEFAULT_DOWNLOAD_EXPIRE_HOURS,
    sendTimeHours: 21,
    sendTimeMinutes: 0,
    policy: '2일 이내',
  },
  {
    id: 5,
    workspace: 'ourwedding',
    productName: '숲',
    displayDeadline: '3시간',
    systemDeadlineHours: 3,
    downloadExpireHours: DEFAULT_DOWNLOAD_EXPIRE_HOURS,
    sendTimeHours: 21,
    sendTimeMinutes: 0,
    policy: '3시간 이내',
  },
  {
    id: 6,
    workspace: 'ourwedding',
    productName: '재수정',
    displayDeadline: '3일',
    systemDeadlineHours: 72,
    downloadExpireHours: DEFAULT_DOWNLOAD_EXPIRE_HOURS,
    sendTimeHours: 21,
    sendTimeMinutes: 0,
    policy: '3일 이내',
  },
  // taility
  {
    id: 7,
    workspace: 'taility',
    productName: '샘플',
    displayDeadline: '2일',
    systemDeadlineHours: 48,
    downloadExpireHours: SAMPLE_DOWNLOAD_EXPIRE_HOURS,
    sendTimeHours: 21,
    sendTimeMinutes: 0,
    policy: '2일 이내',
  },
  {
    id: 8,
    workspace: 'taility',
    productName: '~4일까지',
    displayDeadline: '3일',
    systemDeadlineHours: 72,
    downloadExpireHours: DEFAULT_DOWNLOAD_EXPIRE_HOURS,
    sendTimeHours: 21,
    sendTimeMinutes: 0,
    policy: '3일 이내',
  },
  {
    id: 9,
    workspace: 'taility',
    productName: '~48시간안에',
    displayDeadline: '2일',
    systemDeadlineHours: 48,
    downloadExpireHours: DEFAULT_DOWNLOAD_EXPIRE_HOURS,
    sendTimeHours: 21,
    sendTimeMinutes: 0,
    policy: '2일 이내',
  },
  {
    id: 10,
    workspace: 'taility',
    productName: '당일 6시간 안에(3장이상부터)',
    displayDeadline: '5시간',
    systemDeadlineHours: 5,
    downloadExpireHours: DEFAULT_DOWNLOAD_EXPIRE_HOURS,
    sendTimeHours: 21,
    sendTimeMinutes: 0,
    policy: '5시간 이내',
  },
  {
    id: 11,
    workspace: 'taility',
    productName: '재수정',
    displayDeadline: '3일',
    systemDeadlineHours: 72,
    downloadExpireHours: DEFAULT_DOWNLOAD_EXPIRE_HOURS,
    sendTimeHours: 21,
    sendTimeMinutes: 0,
    policy: '3일 이내',
  },
  // wantswedding
  {
    id: 12,
    workspace: 'wantswedding',
    productName: '샘플',
    displayDeadline: '2일',
    systemDeadlineHours: 48,
    downloadExpireHours: SAMPLE_DOWNLOAD_EXPIRE_HOURS,
    sendTimeHours: 21,
    sendTimeMinutes: 0,
    policy: '2일 이내',
  },
  {
    id: 13,
    workspace: 'wantswedding',
    productName: '~4일',
    displayDeadline: '3일',
    systemDeadlineHours: 72,
    downloadExpireHours: DEFAULT_DOWNLOAD_EXPIRE_HOURS,
    sendTimeHours: 21,
    sendTimeMinutes: 0,
    policy: '3일 이내',
  },
  {
    id: 14,
    workspace: 'wantswedding',
    productName: '~48시간',
    displayDeadline: '2일',
    systemDeadlineHours: 48,
    downloadExpireHours: DEFAULT_DOWNLOAD_EXPIRE_HOURS,
    sendTimeHours: 21,
    sendTimeMinutes: 0,
    policy: '2일 이내',
  },
  {
    id: 15,
    workspace: 'wantswedding',
    productName: '재수정',
    displayDeadline: '3일',
    systemDeadlineHours: 72,
    downloadExpireHours: DEFAULT_DOWNLOAD_EXPIRE_HOURS,
    sendTimeHours: 21,
    sendTimeMinutes: 0,
    policy: '3일 이내',
  },
];

export default function ProductDeadlineRulesView() {
  const [rules, setRules] = useState(initialRules);
  const [editDialog, setEditDialog] = useState({ open: false, rule: null });
  const [addDialog, setAddDialog] = useState(false);
  const [workspace, setWorkspace] = useState(getWorkspaceId() || '');

  const [form, setForm] = useState({
    productName: '',
    displayDeadline: '',
    systemDeadlineHours: '',
    policy: '',
    sendTimeHours: DEFAULT_SEND_TIME_HOUR,
    sendTimeMinutes: DEFAULT_SEND_TIME_MINUTE,
  });

  // 워크스페이스 변경 감지용 ref
  const prevWorkspaceRef = useRef(getWorkspaceId() || '');

  // Homepage/view.jsx 참고: 워크스페이스 변경 감지 및 동기화
  useEffect(() => {
    let isMounted = true;

    function syncWorkspace() {
      const ws = getWorkspaceId() || '';
      if (isMounted) setWorkspace(ws);
    }

    // 최초 mount 시
    syncWorkspace();

    // storage 이벤트 리스너 등록 (다른 탭에서 변경 시)
    const handleStorage = (e) => {
      if (e.key === 'selectedWorkspaceId') {
        syncWorkspace();
      }
    };
    window.addEventListener('storage', handleStorage);

    // polling: detect local changes (동일 탭에서 localStorage 직접 변경 시)
    let prev = getWorkspaceId() || '';
    const interval = setInterval(() => {
      const curr = getWorkspaceId() || '';
      if (curr !== prev) {
        prev = curr;
        setWorkspace(curr);
      }
    }, 500);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  // 워크스페이스가 바뀌면 폼 초기화 및 다이얼로그 닫기
  useEffect(() => {
    if (prevWorkspaceRef.current && prevWorkspaceRef.current !== workspace) {
      setForm({
        productName: '',
        displayDeadline: '',
        systemDeadlineHours: '',
        policy: '',
        sendTimeHours: DEFAULT_SEND_TIME_HOUR,
        sendTimeMinutes: DEFAULT_SEND_TIME_MINUTE,
      });
      setEditDialog({ open: false, rule: null });
      setAddDialog(false);
    }
    prevWorkspaceRef.current = workspace;
  }, [workspace]);

  // Filter rules by workspace
  const filteredRules = workspace ? rules.filter((r) => r.workspace === workspace) : [];

  const handleEditOpen = (rule) => {
    // Remove workspace from form, since it's fixed
    const { workspace, downloadExpireHours, ...rest } = rule;
    setForm({
      ...rest,
      systemDeadlineHours: rest.systemDeadlineHours?.toString() ?? '',
      sendTimeHours:
        typeof rest.sendTimeHours === 'number' ? rest.sendTimeHours : DEFAULT_SEND_TIME_HOUR,
      sendTimeMinutes:
        typeof rest.sendTimeMinutes === 'number' ? rest.sendTimeMinutes : DEFAULT_SEND_TIME_MINUTE,
    });
    setEditDialog({ open: true, rule });
  };

  const handleEditClose = () => {
    setEditDialog({ open: false, rule: null });
    setForm({
      productName: '',
      displayDeadline: '',
      systemDeadlineHours: '',
      policy: '',
      sendTimeHours: DEFAULT_SEND_TIME_HOUR,
      sendTimeMinutes: DEFAULT_SEND_TIME_MINUTE,
    });
  };

  const handleEditSave = () => {
    const isSample = form.productName.includes('샘플');
    setRules((prev) =>
      prev.map((r) =>
        r.id === editDialog.rule.id
          ? {
              ...r,
              ...form,
              workspace,
              systemDeadlineHours: Number(form.systemDeadlineHours),
              downloadExpireHours: isSample
                ? SAMPLE_DOWNLOAD_EXPIRE_HOURS
                : DEFAULT_DOWNLOAD_EXPIRE_HOURS,
              sendTimeHours: Number(form.sendTimeHours),
              sendTimeMinutes: Number(form.sendTimeMinutes),
            }
          : r
      )
    );
    handleEditClose();
  };

  const handleAddOpen = () => {
    setForm({
      productName: '',
      displayDeadline: '',
      systemDeadlineHours: '',
      policy: '',
      sendTimeHours: DEFAULT_SEND_TIME_HOUR,
      sendTimeMinutes: DEFAULT_SEND_TIME_MINUTE,
    });
    setAddDialog(true);
  };

  const handleAddClose = () => {
    setAddDialog(false);
    setForm({
      productName: '',
      displayDeadline: '',
      systemDeadlineHours: '',
      policy: '',
      sendTimeHours: DEFAULT_SEND_TIME_HOUR,
      sendTimeMinutes: DEFAULT_SEND_TIME_MINUTE,
    });
  };

  const handleAddSave = () => {
    const isSample = form.productName.includes('샘플');
    setRules((prev) => [
      ...prev,
      {
        ...form,
        workspace,
        id: prev.length ? Math.max(...prev.map((r) => r.id)) + 1 : 1,
        systemDeadlineHours: Number(form.systemDeadlineHours),
        downloadExpireHours: isSample
          ? SAMPLE_DOWNLOAD_EXPIRE_HOURS
          : DEFAULT_DOWNLOAD_EXPIRE_HOURS,
        sendTimeHours: Number(form.sendTimeHours),
        sendTimeMinutes: Number(form.sendTimeMinutes),
      },
    ]);
    handleAddClose();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Helper to format hours to "n일 n시간" if >= 24
  const formatHours = (hours) => {
    if (typeof hours !== 'number' || isNaN(hours)) return '';
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remain = hours % 24;
      return `${hours} (${days}일${remain ? ` ${remain}시간` : ''})`;
    }
    return `${hours}시간`;
  };

  // 전송시간 표기 (hh:mm)
  const formatSendTime = (rule) => {
    const h = typeof rule.sendTimeHours === 'number' ? rule.sendTimeHours : DEFAULT_SEND_TIME_HOUR;
    const m = typeof rule.sendTimeMinutes === 'number' ? rule.sendTimeMinutes : 0;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  // 다운로드 만료기한 표기 (샘플이면 6개월, 아니면 1달) - 개월수만 표시
  const getDownloadExpireText = (rule) => {
    if (rule.productName.includes('샘플')) {
      return `6개월`;
    }
    return `1달`;
  };

  // 전송시간 입력 핸들러 (0~23, 0~59)
  const handleSendTimeChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === 'sendTimeHours') {
      v = Math.max(0, Math.min(23, Number(value)));
    }
    if (name === 'sendTimeMinutes') {
      v = Math.max(0, Math.min(59, Number(value)));
    }
    setForm((prev) => ({
      ...prev,
      [name]: v,
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h4" gutterBottom>
          상품 마감 정책 관리
        </Typography>
        <Typography variant="body2" color="text.secondary">
          상품별로 신부님께 표시되는 마감 기간, 실제 적용되는 기간(시간 단위), 다운로드 만료기한,
          전송시간, 정책 등을 관리할 수 있습니다.
        </Typography>
        {/* 마감일 산정 기준 안내 Alert 수정: 마감기준은 접수일 기준임을 명시 */}
        <Alert severity="info" sx={{ whiteSpace: 'pre-line' }}>
          <b>전송일 산정 기준 안내</b>
          <br />- <b>마감 기준은 접수일 기준</b>입니다.
          <br />- <b>마감기한을 접수일에 더해</b> 마감 시점을 계산합니다.
          <br />- <b>마감 기준 시간은 21시</b>입니다. (매일 21시 기준)
          <br />
          - 마감기한이 지난 시점과 같은 날짜의 21시를 비교합니다.
          <br />- <b>계산된 날짜가 해당 날짜 21시 이전이면, 하루 전 21시로 전송일 조정</b>
          <br />- <b>계산된 날짜가 해당 날짜 21시 이후거나 같으면, 그날 21시가 전송일</b>이 됩니다.
          <br />
          <br />
          <b>예시1)</b> 6월 1일 15:00 주문(접수), 마감기한 48시간 → 6월 3일 15:00이 마감 시점
          <br />
          &nbsp;&nbsp;6월 3일 21:00보다 <b>이전</b>이므로 <b>6월 2일 21:00</b>이 전송일로
          조정됩니다.
          <br />
          <b>예시2)</b> 6월 1일 20:00 주문(접수), 마감기한 48시간 → 6월 3일 20:00이 마감 시점
          <br />
          &nbsp;&nbsp;6월 3일 21:00보다 <b>이후</b>이므로 <b>6월 3일 21:00</b>이 전송일로
          설정됩니다.
        </Alert>

        <Button
          variant="contained"
          onClick={handleAddOpen}
          disabled={!workspace}
          sx={{ width: 120 }}
        >
          규칙 추가
        </Button>
        <Divider />
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {/* 워크스페이스 컬럼 제거 */}
                <TableCell>상품명/등급</TableCell>
                <TableCell>신부님 표기 마감기간</TableCell>
                <TableCell>주문 마감기한(시간)</TableCell>
                <TableCell>다운로드 만료기한</TableCell>
                <TableCell>전송시간</TableCell>
                <TableCell>정책/비고</TableCell>
                <TableCell align="center">수정</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRules.map((rule) => (
                <TableRow key={rule.id}>
                  {/* 워크스페이스 컬럼 제거 */}
                  <TableCell>{rule.productName}</TableCell>
                  <TableCell>{rule.displayDeadline}</TableCell>
                  <TableCell>{formatHours(rule.systemDeadlineHours)}</TableCell>
                  <TableCell>{getDownloadExpireText(rule)}</TableCell>
                  <TableCell>{formatSendTime(rule)}</TableCell>
                  <TableCell>{rule.policy}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleEditOpen(rule)}>
                      <Iconify icon={'solar:pen-bold'} fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    등록된 규칙이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={handleEditClose} maxWidth="xs" fullWidth>
        <DialogTitle>규칙 수정</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {/* 워크스페이스 select 제거, workspace는 고정 */}
            <TextField
              name="productName"
              label="상품명/등급"
              value={form.productName}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              name="displayDeadline"
              label="신부님 표기 마감기간"
              value={form.displayDeadline}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              name="systemDeadlineHours"
              label="주문 마감기한(시간)"
              value={form.systemDeadlineHours}
              onChange={handleFormChange}
              fullWidth
              type="number"
              inputProps={{ min: 1 }}
              helperText="예: 48(2일), 3(3시간)"
            />
            <TextField
              name="policy"
              label="정책/비고"
              value={form.policy}
              onChange={handleFormChange}
              fullWidth
              multiline
              minRows={2}
            />
            <TextField
              label="다운로드 만료기한"
              value={form.productName.includes('샘플') ? '6개월(자동설정)' : '1달(자동설정)'}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              sx={{ mt: 1 }}
              helperText="샘플은 6개월, 그 외는 1달로 자동 설정됩니다."
            />
            <Grid container spacing={1} alignItems="center" sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField
                  name="sendTimeHours"
                  label="전송시간(시)"
                  type="number"
                  value={form.sendTimeHours}
                  onChange={handleSendTimeChange}
                  inputProps={{ min: 0, max: 23 }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="sendTimeMinutes"
                  label="전송시간(분)"
                  type="number"
                  value={form.sendTimeMinutes}
                  onChange={handleSendTimeChange}
                  inputProps={{ min: 0, max: 59 }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  0~23시, 0~59분 입력 가능. 예: 21시 0분(밤 9시), 9시 30분 등
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>취소</Button>
          <Button variant="contained" onClick={handleEditSave}>
            저장
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialog} onClose={handleAddClose} maxWidth="xs" fullWidth>
        <DialogTitle>규칙 추가</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {/* 워크스페이스 select 제거, workspace는 고정 */}
            <TextField
              name="productName"
              label="상품명/등급"
              value={form.productName}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              name="displayDeadline"
              label="신부님 표기 마감기간"
              value={form.displayDeadline}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              name="systemDeadlineHours"
              label="주문 마감기한(시간)"
              value={form.systemDeadlineHours}
              onChange={handleFormChange}
              fullWidth
              type="number"
              inputProps={{ min: 1 }}
              helperText="예: 48(2일), 3(3시간)"
            />
            <TextField
              name="policy"
              label="정책/비고"
              value={form.policy}
              onChange={handleFormChange}
              fullWidth
              multiline
              minRows={2}
            />
            <TextField
              label="다운로드 만료기한"
              value={form.productName.includes('샘플') ? '6개월(자동설정)' : '1달(자동설정)'}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              sx={{ mt: 1 }}
              helperText="샘플은 6개월, 그 외는 1달로 자동 설정됩니다."
            />
            <Grid container spacing={1} alignItems="center" sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField
                  name="sendTimeHours"
                  label="전송시간(시)"
                  type="number"
                  value={form.sendTimeHours}
                  onChange={handleSendTimeChange}
                  inputProps={{ min: 0, max: 23 }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="sendTimeMinutes"
                  label="전송시간(분)"
                  type="number"
                  value={form.sendTimeMinutes}
                  onChange={handleSendTimeChange}
                  inputProps={{ min: 0, max: 59 }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  0~23시, 0~59분 입력 가능. 예: 21시 0분(밤 9시), 9시 30분 등
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>취소</Button>
          <Button variant="contained" onClick={handleAddSave} disabled={!workspace}>
            추가
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
