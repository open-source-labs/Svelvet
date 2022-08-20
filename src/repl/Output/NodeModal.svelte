<script>
</script>

<div id="myModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <span class="close">&times;</span>
      <h2>Build New Node</h2>
    </div>
    <div class="modal-body">
      <input type="text" />
      <input type="text" />
      <input type="text" />
      <input type="text" />
      <input type="text" />
      <input type="text" />
    </div>
    <div class="modal-footer">
      <h3>Modal Footer</h3>
    </div>
  </div>
</div>

<style>
	input {
		border: #888 solid 2px;
		border-radius: 5rem;
	}
  /* Modal Header */
  .modal-header {
    padding: 2px 16px;
    background-color: #5cb85c;
    color: white;
    z-index: 1;
  }

  /* Modal Body */
  .modal-body {
    padding: 2px 16px;
    opacity: 100;
    z-index: 1;
  }

  /* Modal Footer */
  .modal-footer {
    padding: 2px 16px;
    background-color: #5cb85c;
    color: white;
    z-index: 1;
  }

  /* Modal Content */
  .modal-content {
    position: fixed;
    background-color: #5cb85c;
    margin: 15% auto;
    padding: 1rem;
    border: 1px solid #888;
    max-width: 40vw;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    animation-name: animatetop;
    animation-duration: 0.4s;
    z-index: 1;
  }

  /* Add Animation */
  @keyframes animatetop {
    from {
      top: -300px;
      opacity: 0;
    }
    to {
      top: 0;
      opacity: 20;
    }
  }
</style>
