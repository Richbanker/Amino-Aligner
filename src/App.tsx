import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Paper, TextField, Button, Select, MenuItem, Snackbar } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { AlignmentView } from './AlignmentView';

const AMINO_REGEX = /^[ARNDCEQGHILKMFPSTWYV-]+$/i;

interface FormValues {
  seq1: string;
  seq2: string;
}

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = React.useState(i18n.language);
  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { seq1: '', seq2: '' },
  });
  const seq1 = watch('seq1');
  const seq2 = watch('seq2');
  const [alignment, setAlignment] = React.useState<{seq1: string, seq2: string} | null>(null);
  const [copied, setCopied] = React.useState(false);
  const alignmentRef = React.useRef<HTMLDivElement>(null);

  const handleLangChange = (event: any) => {
    const newLang = event.target.value as string;
    setLang(newLang);
    i18n.changeLanguage(newLang);
  };

  const onSubmit = (data: FormValues) => {
    setAlignment({ seq1: data.seq1, seq2: data.seq2 });
    setTimeout(() => {
      alignmentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <Box className="App">
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" fill="#1976d2" />
            <circle cx="10" cy="10" r="4" fill="#fff" stroke="#1976d2" strokeWidth="2"/>
            <circle cx="30" cy="10" r="4" fill="#fff" stroke="#1976d2" strokeWidth="2"/>
            <circle cx="20" cy="30" r="4" fill="#fff" stroke="#1976d2" strokeWidth="2"/>
            <line x1="13" y1="13" x2="20" y2="26" stroke="#1976d2" strokeWidth="2"/>
            <line x1="27" y1="13" x2="20" y2="26" stroke="#1976d2" strokeWidth="2"/>
            <line x1="13" y1="13" x2="27" y2="13" stroke="#1976d2" strokeWidth="2"/>
            <text x="50%" y="62%" textAnchor="middle" fill="#1976d2" fontSize="16" fontWeight="bold" dy=".3em">A</text>
          </svg>
        </span>
        <Box sx={{ fontWeight: 800, fontSize: 28, color: '#1976d2', letterSpacing: 1 }}>
          Amino Aligner
        </Box>
        <Box sx={{ flex: 1 }} />
        <Select value={lang} onChange={handleLangChange} size="small" sx={{ minWidth: 110, fontWeight: 600 }} >
          <MenuItem value="ru">Русский</MenuItem>
          <MenuItem value="en">English</MenuItem>
        </Select>
      </Box>
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, maxWidth: 600, mx: 'auto', mb: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Controller
            name="seq1"
            control={control}
            rules={{
              required: t('input_label_1') + ' ' + t('required'),
              pattern: {
                value: AMINO_REGEX,
                message: t('input_label_1') + ' ' + t('invalid_chars'),
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('input_label_1')}
                variant="outlined"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                error={!!errors.seq1}
                helperText={errors.seq1?.message as string}
                inputProps={{ maxLength: 2000, autoComplete: 'off', style: { fontFamily: 'monospace' } }}
              />
            )}
          />
          <Controller
            name="seq2"
            control={control}
            rules={{
              required: t('input_label_2') + ' ' + t('required'),
              pattern: {
                value: AMINO_REGEX,
                message: t('input_label_2') + ' ' + t('invalid_chars'),
              },
              validate: (value: string) => value.length === seq1.length || t('lengths_must_match'),
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('input_label_2')}
                variant="outlined"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                error={!!errors.seq2}
                helperText={errors.seq2?.message as string}
                inputProps={{ maxLength: 2000, autoComplete: 'off', style: { fontFamily: 'monospace' } }}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 1.2, fontSize: 16, mt: 1, borderRadius: 2, fontWeight: 600 }}
            disabled={!seq1 || !seq2 || seq1.length !== seq2.length}
          >
            {t('submit')}
          </Button>
        </form>
      </Paper>
      {alignment && (
        <Paper elevation={1} sx={{ p: { xs: 1, sm: 2 }, borderRadius: 3, maxWidth: 600, mx: 'auto', mb: 2 }} ref={alignmentRef}>
          <AlignmentView
            seq1={alignment.seq1}
            seq2={alignment.seq2}
            onCopy={() => setCopied(true)}
          />
        </Paper>
      )}
      <Snackbar
        open={copied}
        message={t('copied')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={1000}
        onClose={() => setCopied(false)}
      />
    </Box>
  );
};

export default App;
