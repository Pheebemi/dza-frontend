import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        alignItems: 'flex-start',
        gap: 1,
        mb: 1.5,
      }}
    >
      {!isUser && (
        <Avatar
          sx={{
            bgcolor: 'secondary.main',
            color: 'primary.main',
            width: 32,
            height: 32,
            fontSize: '0.875rem',
            fontWeight: 700,
            flexShrink: 0,
            mt: 0.5,
          }}
        >
          M
        </Avatar>
      )}

      <Paper
        elevation={0}
        sx={{
          maxWidth: '80%',
          px: 2,
          py: 1.5,
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          bgcolor: isUser ? 'primary.main' : '#FFFDE7',
          color: isUser ? 'white' : 'text.primary',
          border: '1px solid',
          borderColor: isUser ? 'primary.main' : 'rgba(255, 214, 0, 0.4)',
        }}
      >
        {content.split('\n').map((line, i) => (
          <Typography key={i} variant="body2" sx={{ lineHeight: 1.65, mt: i > 0 ? 0.5 : 0 }}>
            {line}
          </Typography>
        ))}
      </Paper>
    </Box>
  );
}
