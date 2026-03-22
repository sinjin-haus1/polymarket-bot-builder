'use client';
import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';
import { TrendingUp, ShowChart, LineWeight, Speed } from '@mui/icons-material';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/graphql';

const INDICATOR_TYPES = [
  { type: 'RSI', label: 'RSI', icon: <Speed />, color: '#f59e0b', description: 'Relative Strength Index — momentum oscillator (0-100)' },
  { type: 'MACD', label: 'MACD', icon: <ShowChart />, color: '#8b5cf6', description: 'Moving Average Convergence Divergence — trend & momentum' },
  { type: 'SMA', label: 'SMA', icon: <TrendingUp />, color: '#3b82f6', description: 'Simple Moving Average — average price over period' },
  { type: 'EMA', label: 'EMA', icon: <LineWeight />, color: '#10b981', description: 'Exponential Moving Average — weighted average favoring recent' },
];

export default function IndicatorsPage() {
  const [prices, setPrices] = useState<string>('');
  const [period, setPeriod] = useState<number>(14);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const calculate = async (type: string) => {
    setError('');
    setResult(null);
    const priceArray = prices
      .split(',')
      .map((p) => parseFloat(p.trim()))
      .filter((p) => !isNaN(p));

    if (priceArray.length < 2) {
      setError('Enter at least 2 comma-separated price values.');
      return;
    }

    setLoading(true);
    try {
      const query = `
        query CalculateIndicator($type: IndicatorTypeEnum!, $prices: [Float!]!, $period: Int) {
          calculateIndicator(type: $type, prices: $prices, period: $period) {
            type
            values
            signal
            histogram
          }
        }
      `;
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          variables: { type, prices: priceArray, period },
        }),
      });
      const json = await res.json();
      if (json.errors) throw new Error(json.errors[0].message);
      setResult(json.data?.calculateIndicator);
    } catch (e: any) {
      setError(e.message ?? 'Calculation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight={700} gutterBottom sx={{ color: 'primary.main' }}>
          📊 Indicator Library
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Pre-built TradingView-style technical indicators. Enter price data and calculate RSI, MACD, SMA, or EMA.
        </Typography>

        {/* Indicator Type Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {INDICATOR_TYPES.map(({ type, label, icon, color, description }) => (
            <Grid item xs={12} sm={6} md={3} key={type}>
              <Card sx={{ bgcolor: 'background.paper', border: `1px solid ${color}33` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ color }}>{icon}</Box>
                    <Typography variant="h6">{label}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {description}
                  </Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 2, color, borderColor: color }}
                    onClick={() => calculate(type)}
                    disabled={loading}
                  >
                    Calculate
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Input Panel */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
          <Typography variant="h6" gutterBottom>
            Price Data Input
          </Typography>
          <TextField
            fullWidth
            label="Comma-separated prices"
            placeholder="e.g. 100, 102, 101, 105, 103, 107, 110, 108, 112, 115, 113, 118, 116, 120, 122"
            value={prices}
            onChange={(e) => setPrices(e.target.value)}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Period"
            type="number"
            value={period}
            onChange={(e) => setPeriod(parseInt(e.target.value) || 14)}
            sx={{ width: 150 }}
            inputProps={{ min: 2, max: 200 }}
          />
        </Paper>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Results */}
        {result && (
          <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip label={result.type} color="primary" />
              <Typography variant="body2" color="text.secondary">
                {result.values?.length ?? 0} data points computed
              </Typography>
            </Box>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Value</TableCell>
                  {result.signal && <TableCell>Signal</TableCell>}
                  {result.histogram && <TableCell>Histogram</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {(result.values ?? []).slice(0, 50).map((v: number, i: number) => (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{typeof v === 'number' ? v.toFixed(4) : v}</TableCell>
                    {result.signal && (
                      <TableCell>
                        {typeof result.signal[i] === 'number'
                          ? result.signal[i].toFixed(4)
                          : '—'}
                      </TableCell>
                    )}
                    {result.histogram && (
                      <TableCell>
                        {typeof result.histogram[i] === 'number'
                          ? result.histogram[i].toFixed(4)
                          : '—'}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {result.values?.length > 50 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Showing first 50 of {result.values.length} values. Export coming soon.
              </Typography>
            )}
          </Paper>
        )}
      </Container>
    </Box>
  );
}
