import React from "react";
import { Modal, Box, Button, Typography, Stack, Divider } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const DeleteModal = ({ open, setOpen, id, handleDelete }) => {
  const handleClose = () => setOpen(false);
  
  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      BackdropProps={{
        invisible: true, // Removes the backdrop (black background)
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#fff",
          boxShadow: 24,
          borderRadius: 3,
          width: 500, // Increased size
          padding: 4, // More padding for better spacing
          border: "1px solid #ddd",
          outline: "none",
        }}
      >
        {/* Modal Content */}
        <Typography variant="h6" align="center" sx={{ marginBottom: 3 }}>
          Are you sure you want to delete this item?
        </Typography>

        <Divider sx={{ marginBottom: 3 }} />

        <Stack direction="row" spacing={4} justifyContent="center">
          {" "}
          {/* Increased gap between buttons */}
          {/* Cancel Button */}
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              width: "45%",
              backgroundColor: "#f0f0f0",
              color: "#333",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            Cancel
          </Button>
          {/* Delete Button */}
          <Button
            variant="contained"
            onClick={() => handleDelete(id)}
            sx={{
              width: "45%",
              backgroundColor: "#FF4040",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#e53935",
              },
            }}
            startIcon={<DeleteForeverIcon />}
          >
            Delete
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default DeleteModal;